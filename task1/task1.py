import dropbox
import datetime
import random
import pandas as pd 
import io

# Connect to dropbox using access token
TOKEN = ''
dbx = dropbox.Dropbox(TOKEN)

def main():
    """Main program

    Download csv from dropbox, then anonymize date of consent and add age, finally upload csv to dropbox
    """
    df = downloadData("/recruitment_project/enroll_data.csv")
    addAge(df)
    offset_df = anonyDate(df)
    uploadData(offset_df, "/recruitment_project/enroll_data_offset_PJ.csv", dropbox.files.WriteMode.overwrite, False)
    uploadData(df, "/recruitment_project/enroll_data_anon_PJ.csv", dropbox.files.WriteMode.overwrite, True)


def downloadData(path):
    """Download csv from dropbox 
    
    Download csv from dropbox, transform to a DataFrame, and return the DataFrame
    """
    try:
        _metadata, res = dbx.files_download(path)
    except dropbox.exceptions.HttpError as err:
        print('*** HTTP error', err)
        return None
    
    with io.BytesIO(res.content) as stream:
        data = pd.read_csv(stream, index_col=0)
    
    print('download success')
    return data


def uploadData(df, path, mode, index):
    """Upload csv to dropbox

    Take a DataFrame, and upload the data to dropbox as csv
    """
    df_string = df.to_csv(index=index)
    db_bytes = bytes(df_string, 'utf8')
    
    try:
        res = dbx.files_upload(db_bytes, path, mode, mute=True)
    except dropbox.exceptions.ApiError as err:
        print('*** API error', err)
        return None

    print('uploaded as', res.name.encode('utf8'))
    return res

 
def anonyDate(df):
    """Anonymize date of consent

    Anonymize date of consent to a random date between first and last date of 1924, then calculate the offset between date of consent and random date.
    Finally return offset DataFrame 
    """
    offset = []
    for index, row in df.iterrows():
        randomDate = generateRandomDate(datetime.date(1924, 1, 1), datetime.date(1924, 12, 31))
        dateList = row["date of consent"].split("/")
        date = datetime.date(int(dateList[2]), int(dateList[0]), int(dateList[1]))
        offset.append((date - randomDate).days)
        row["date of consent"] = randomDate
    df.rename(columns = {"date of consent": "disguised date of consent"}, inplace = True)
    offset_df = pd.DataFrame(offset)
    offset_df.columns = ["days_offset"]
    return offset_df


def generateRandomDate(startDate, endDate):
    """Generate a random date
    
    Calculate a random date between startDate and endDate, then return the generated random date
    """
    timeBetweenDates = endDate - startDate
    daysBetweenDates = timeBetweenDates.days
    randomDays = random.randrange(daysBetweenDates)
    randomDate = startDate + datetime.timedelta(days=randomDays)
    return randomDate


def addAge(df):
    """
    Replace birth date column to age
    """
    for index, row in df.iterrows():
        birthYear = int(row["birth date"][0:4])
        birthMonth = int(row["birth date"][5:7])
        birthDay = int(row["birth date"][8:])
        dateOfConsent = row["date of consent"].split("/")
        dateOfConsentYear = int(dateOfConsent[2])
        dateOfConsentMonth = int(dateOfConsent[0])
        dateOfConsentDay = int(dateOfConsent[1])
        row["birth date"] = calculateAge(datetime.datetime(birthYear, birthMonth, birthDay), datetime.datetime(dateOfConsentYear, dateOfConsentMonth, dateOfConsentDay))
    df.rename(columns = {"birth date": "age"}, inplace = True)


def calculateAge(birthDate, endDate):
    """Calculate age
    
    Calculate age at endDate, then return age
    """
    age = endDate.year - birthDate.year - ((endDate.month, endDate.day) < (birthDate.month, birthDate.day))
    return age


if __name__ == '__main__':
    main()