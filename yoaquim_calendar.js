 function Calendar(elmntId) {

     //Create properties
     var test = new Date();
     this.currentDate = new Date();
     this.activeDate = new Date();
     this.weeks = [];
   
     //Create cal data and listen for arrow keys
     this.weeks = this.createCalData(this.activeDate);
     this.listenForKeys();

     //Create DOM elements, with corresponding classes/ids
     //and append them hierarchaly 
     var calendar = document.createElement("DIV");
     calendar.setAttribute("class", "intent-cal");
     var leftPane = this.createLeftPane();
     var rightPane = this.createRightPane();
     calendar.appendChild(leftPane);
     calendar.appendChild(rightPane);

     //Attach calendar to specified element
     var container = document.getElementById(elmntId);
     container.appendChild(calendar);
 }

 Calendar.prototype = {
     //Create initial Calendar data
     createCalData: function (activeDate) {
         var weeksArray = [];
         for (var i = 0; i < 6; i++) {
           weeksArray[i] = new Array(7);
         };
     
         var date = new Date(activeDate);
         //Define vars to populate calendar
         var weekIndex = 0;
         date.setDate(1);

         //Populate Calendar
         while (date.getMonth() === this.activeDate.getMonth()) {
             if (date.getDate() !== 1 && this.yesterday(date).getDay() === 6) {
                 weekIndex++;
             }
             weeksArray[weekIndex][date.getDay()] = new Date(date);
             date.setDate(date.getDate() + 1);
         }
         return weeksArray;
     },
     //Create pane holding weekday and current date
     createLeftPane: function () {
         var calLeft = document.createElement("DIV");
         calLeft.setAttribute("class", "intent-cal-left-pane");

         //Create current date display (date number)
         var currentDate = document.createElement("DIV");
         currentDate.setAttribute("id", "intent-cal-current-date");
         currentDate.textContent = this.currentDate.getDate();

         //Create header that displays head of week above date number
         var dayOfWeek = document.createElement("DIV");
         dayOfWeek.setAttribute("id", "intent-cal-day-of-week");
         dayOfWeek.textContent = this.getWeekDay(this.currentDate.getDay());

         //Append day to left pane and return
         calLeft.appendChild(dayOfWeek);
         calLeft.appendChild(currentDate);

         return calLeft;
     },
     //Create pane holding calendar, navs and month/year header
     createRightPane: function () {
         var calRight = document.createElement("DIV");
         calRight.setAttribute("class", "intent-cal-right-pane");

         //Create calendar header; holds prev, next function and current month and year
         var calRightHeader = document.createElement("DIV");
         calRightHeader.setAttribute("class", "intent-cal-rp-header");

         //Create month-year display    
         var currentMonthYear = document.createElement("DIV");
         currentMonthYear.setAttribute("id", "intent-cal-current-month-year");
         currentMonthYear.textContent = this.getMonthHeader(this.currentDate);
       
         var changeMonthHandler = function(next){
           return function(){
             if(next){
               calendar.changeMonth(true);               
             }else{
               calendar.changeMonth(false);
             }
           }
         };
       
         //Create element that triggers prev month
         var prevMonth = document.createElement("DIV");
         prevMonth.setAttribute("id", "intent-cal-prev-month");
         prevMonth.textContent = "<";
         prevMonth.onclick = changeMonthHandler(false);

         //Create element that triggers next month
         var nextMonth = document.createElement("DIV");
         nextMonth.setAttribute("id", "intent-cal-next-month");
         nextMonth.textContent = ">";
         nextMonth.onclick = changeMonthHandler(true);

         //Append prev, next and month-year to calendar header
         calRightHeader.appendChild(prevMonth);
         calRightHeader.appendChild(currentMonthYear);
         calRightHeader.appendChild(nextMonth);

         //Create actual weeks/days
         var weeksGrid = this.createWeeksGrid(this.weeks);

         //Append to right pane and return
         calRight.appendChild(calRightHeader);
         calRight.appendChild(weeksGrid);

         return calRight;
     },

     //Create actual calendar
     createWeeksGrid: function (weeksArray) {
         var calendar = this;
         //Create weeks holder
         var weekGrid = document.createElement("DIV");
         weekGrid.setAttribute("class", "week-grid");

         //Create weekday indicator row/week (first letter of day)
         var weeksTitle = document.createElement("UL");
         weeksTitle.setAttribute("class", "intent-cal-week");

         for (var i = 0; i < 7; i++) {
             var dayElmnt = document.createElement("LI");
             dayElmnt.textContent = this.getWeekDay(i).substring(0, 1);
             dayElmnt.setAttribute("class", "intent-cal-day-title");
             weeksTitle.appendChild(dayElmnt);
         }

         var calWeeks = this.createDays(weekGrid);
         weekGrid.appendChild(weeksTitle);
         weekGrid.appendChild(calWeeks);


         return weekGrid;
     },

     createDays: function () {
         var calWeeks = document.createElement("DIV");
         calWeeks.setAttribute("id", "intent-cal-day-data");

         //Click handler for calendary days
         var createClickHandler = function (element, date) {
             return function () {
                 calendar.updateLeftPane(element, date);
             };
         };

         //Create and Populate actual weeks
         for (var i = 0; i < 6; i++) {
             var weekElmnt = document.createElement("UL");
             weekElmnt.setAttribute("class", "intent-cal-week");

             var week = this.weeks[i];
             //Create and populate days


             for (var j = 0; j < week.length; j++) {
                 var calday = document.createElement("LI");

                 if ( !! week[j]) {
                     calday.textContent = week[j].getDate();
                     calday.setAttribute("class", "intent-cal-day");
                 } else {
                     calday.textContent = "";
                     calday.setAttribute("class", "intent-cal-empty-day");
                 }

                 if ( !! week[j] && week[j].getDate() == this.currentDate.getDate()) {
                     calday.setAttribute("id", "intent-cal-today");
                 }

                 calday.onclick = createClickHandler(calday, week[j]);

                 weekElmnt.appendChild(calday);
             }

             calWeeks.appendChild(weekElmnt);
         }
         return calWeeks;
     },

     updateDays: function (data) {
         //Click handler for calendary days
         var createClickHandler = function (element, date) {
             return function () {
                 calendar.updateLeftPane(element, date);
             };
         };
       
         var calWeeks = document.getElementById("intent-cal-day-data");
         var weeks = calWeeks.childNodes;
         for (var i = 0; i < weeks.length; i++) {
             for (var j = 0; j < weeks[i].children.length; j++) {
                 var dayData =data[i][j];  
                 var day = weeks[i].children[j];
                 if ( !!dayData) {
                     day.textContent = dayData.getDate();
                     day.setAttribute("class", "intent-cal-day");
                     day.onclick = createClickHandler(day, dayData);
                        
                   	  if(dayData.toString().substring(0,15)===this.currentDate.toString().substring(0,15)){
                        day.setAttribute("id", "intent-cal-today");
                      }
                 } else {
                     day.textContent = "";
                     day.setAttribute("class", "intent-cal-empty-day");
                     day.onclick = null;
                 }
             }
         }
     },

     //Months String Array
     months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

     //Weekdays String Array
     weekDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],

     //Returns month string when given month index
     getMonth: function (monthInt) {
         return this.months[monthInt];
     },

     //Returns weekday string when given day index
     getWeekDay: function (weekDayInt) {
         return this.weekDays[weekDayInt];
     },

     //Returns string of concatenated month and year
     getMonthHeader: function (date) {
         return this.months[date.getMonth()] + " " + date.getFullYear();
     },

     //Returns yesterday's date
     yesterday: function (date) {
         return new Date(date.getFullYear(), date.getMonth(), (date.getDate() - 1));
     },

     //Change month; next determines direction
     changeMonth: function (next) {
        //Change month
         var direction = 1;
         if(!next){
           direction = -1;
         }
         this.activeDate = new Date(this.activeDate.getFullYear(), this.activeDate.getMonth() + direction, 1);
         this.weeks = this.createCalData(this.activeDate);
         this.updateDays(this.weeks);
         
         //Update month-year header in right pane
         var monthYear = document.getElementById("intent-cal-current-month-year");
         monthYear.textContent = this.getMonth(this.activeDate.getMonth())+" "+this.activeDate.getFullYear();
         
         //Check if current date is same month and year as calendar date
         var currentDay = this.getMonth(this.currentDate.getMonth())+""+this.currentDate.getFullYear();
         var activeDay = this.getMonth(this.activeDate.getMonth())+""+this.activeDate.getFullYear();
         if(currentDay!==activeDay){
           //remove today highlight
           var today = document.getElementById("intent-cal-today");
           if(!!today){
             today.removeAttribute("id");
           }
         }
         
         //Find first week & day in order to change highlight
         var firstDay;
         var firstWeek = document.getElementById("intent-cal-day-data").children[0];
         for(var i=0; i<firstWeek.children.length; i++){
           if(firstWeek.children[i].className==="intent-cal-day"){
             firstDay = firstWeek.children[i];
             break;
           }
         }
         
         if(currentDay===activeDay){
           this.updateLeftPane(firstDay, this.activeDate, true);
         } else{
           this.updateLeftPane(firstDay, this.activeDate, false);
         }
         
     },

     //Update left pane with selected text
     updateLeftPane: function (element, date, month) {
         if(month){
           date = this.currentDate;
         }
         var currentDate = document.getElementById("intent-cal-current-date");
         currentDate.textContent = date.getDate();

         var weekDay = document.getElementById("intent-cal-day-of-week");
         weekDay.textContent = this.getWeekDay(date.getDay());

         var oldElmnt = document.getElementById("intent-cal-selected-date");
         if ( !! oldElmnt) {
             oldElmnt.removeAttribute("id");
         } 

         if (element.id !== "intent-cal-today" && !month) {
           element.setAttribute("id", "intent-cal-selected-date");
         }
       
         this.activeDate = date;
     },
     //Listen for left and right arrow keys and run appropiate functions
     listenForKeys: function () {
         calendar = this;
			   
			   changeSelectedDays = function(next){
					       //Set date to tomorrow/yesterday 
					       var checkDate;
								 if(next){
									 checkDate = new Date(calendar.activeDate.getFullYear(), calendar.activeDate.getMonth(), calendar.activeDate.getDate()+1);
								 } else{
									 checkDate = new Date(calendar.activeDate.getFullYear(), calendar.activeDate.getMonth(), calendar.activeDate.getDate()-1);
								 }
								 //Check if it's the same month
								 if(checkDate.getMonth()!==calendar.activeDate.getMonth()){
									 return;
								 }else{
									 calendar.activeDate = checkDate;
								 }

					       //Get current selected date
								 var currentSelected = document.getElementById("intent-cal-selected-date");
								 
								 //If cant get current selected date, then that means it's the current month
								 //so get today, otherwise, remove id from current selected date
								 if(!currentSelected){
									 currentSelected = document.getElementById("intent-cal-today");
								 } else{
									 currentSelected.removeAttribute("id");
								 }
								 
								 //Get next selected day's node
								 var nextSelected;
								 if(next){
									 nextSelected = currentSelected.nextSibling;
								 } else{
									 nextSelected = currentSelected.previousSibling;
								 }
								 
								 //Check if said node does not exist, try next/prev week
								 if(!nextSelected){
									 if(next){
										  var nextWeek = currentSelected.parentNode.nextSibling;
										  if(!nextWeek){
										 		return;
									 		} else{
												nextSelected = nextWeek.children[0]; 
											}
										 
									 } else{
										 var prevWeek = currentSelected.parentNode.previousSibling;
										 if(!prevWeek){
										 		return;
									 	 } else{
											 nextSelected = prevWeek.children[prevWeek.children.length-1]; 
										 }
									 }
									 
								 }
								 //If nextnode is today, let updatepane know, else call normally
										if(nextSelected.id=="intent-cal-today"){
											calendar.updateLeftPane(nextSelected, calendar.activeDate, true);
									 } else {
										 calendar.updateLeftPane(nextSelected, calendar.activeDate, false);
									 }
				 };
			 
         document.onkeydown = function () {
             switch (window.event.keyCode) {
                 case 37:
                     //Left key
                     calendar.changeMonth(false);
                     break;
                 case 39:
                     //Right key
                     calendar.changeMonth(true);
                     break;
							 case 38: {
								 //Up key
								 changeSelectedDays(true);							
								 break;
							 }
							 case 40: {
								 //Down key
								 changeSelectedDays(false);	 						
								 break;
						 }
										 
             }
         };
     }
 };

 var cal = new Calendar("cal-container");