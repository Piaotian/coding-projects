# coding-projects

This repo includes 3 folders, task1, task2 and docs.

### 1. task1
This folder includes a python file. The python file is used to anonymize date of consent field to protect privacy, and calculate a new age field to replace the birth date field. It generates 2 csv file `enroll_data_offset_PJ.csv` and `enroll_data_anon_PJ.csv`, and upload to dropbox.

* #### Description of functions in task1.py
  * `downloadData()` - Download csv file from dropbox
  * `uploadData()` - Upload csv file to dropbox
  * `annoyDate()` - Anonymize date of consent column to a random date
  * `generateRandomDate()` - Generate a random date
  * `addAge()` - Replace birth date column to age column
  * `calculateAge()` - Calculate age based on birthDate and the date when you run the code

* #### Dependencies
  `dropbox` `datetime` `random` `pandas` `io`

### 2. task2
This folder create a web application to visualize data. You can view the web application at <https://piaotian.github.io/coding-projects/>

* #### File structure
  * `data.js` - include the data used to visualize
  * `task2.css` - css file for the web application
  * `index.html` - html file for the web application
  * `task2.js` - JavaScript file for the web application

* #### Instructions
  * __Select group__

      Select the group you want the data to group by, you can click the dropdown to select group from __Cohort__ and __Age__.
          
       * Note: age is calculated based on birth date and today's date.
      
  * __Specify the time period__

      Specify the time period that you are interested in and click filter button to filter the data. Only data with date of consent falls in the time period will used to draw the chart. 
   
      When you specify a start date, you won't be able to select an end date earlier than the start date. When you specify an end date, you won't be able to select a start date later than the end date.
  * __Understand the chart__

      The X axis of the chart is site, the Y axis of the chart is the number of enrollment. 
   
      The numbers overlaid on the bar is the percentage of each group for each site. If you hover over the bar, you can see the number of enrollment.

### 3. docs
This folder is used to create Github Pages, and is the same as task2 folder.

## Limitation
The data used in the web application is hard coded. For production version, the data should be saved in database, and fetch through the API.
