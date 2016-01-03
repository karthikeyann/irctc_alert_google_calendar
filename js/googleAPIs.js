

      // Your Client ID can be retrieved from your project in the Google
      // Developer Console, https://console.developers.google.com
      var CLIENT_ID = '182266680014-lkfkkr8g2j4mr8r3aq63v46j73vej1di.apps.googleusercontent.com';

      var SCOPES = ["https://www.googleapis.com/auth/calendar"];

	  
	  
	  function alertResponse() {
        var authorizeDiv = document.getElementById('authorize-div');
		var user_cal_list = document.getElementById('user_calendar_list');
        if ( authorizeDiv.style.display == 'none' && user_cal_list.value != "") {
			console.log("Authorised");
			return true;
        } else {
			console.log("Not Authorised yet");
			return false;
		  //alert("Not Authorized yet");
          // Show auth UI, allowing the user to initiate authorization by
          // clicking authorize button.
          //authorizeDiv.style.display = 'inline';
        }
      }

      /**
       * Check if current user has authorized this application.
       */
      function checkAuth() {
        gapi.auth.authorize(
          {
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
          }, handleAuthResult);
      }

      /**
       * Handle response from authorization server.
       *
       * @param {Object} authResult Authorization result.
       */
      function handleAuthResult(authResult) {
        var authorizeDiv = document.getElementById('authorize-div');
        if (authResult && !authResult.error) {
          // Hide auth UI, then load client library.
          authorizeDiv.style.display = 'none';
          loadCalendarApi();
        } else {
          // Show auth UI, allowing the user to initiate authorization by
          // clicking authorize button.
          authorizeDiv.style.display = 'inline';
        }
      }

      /**
       * Initiate auth flow in response to user clicking authorize button.
       *
       * @param {Event} event Button click event.
       */
      function handleAuthClick(event) {
        gapi.auth.authorize(
          {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
          handleAuthResult);
        return false;
      }

      /**
       * Load Google Calendar client library. List upcoming events
       * once client library is loaded.
       */
      function loadCalendarApi() {
        //gapi.client.load('calendar', 'v3', listUpcomingEvents);
		gapi.client.load('calendar', 'v3', listAllCalendars);
      }

	  
	  function listAllCalendars() {
		var authorizeDiv = document.getElementById('authorize-div');
		$('#user_calendar_list').empty();
        var request = gapi.client.calendar.calendarList.list();

        request.execute(function(resp) {
          var events = resp.items;
          //appendPre('All Calendars:');

          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var event = events[i];
			  $('#user_calendar_list').append($('<option>', {
				value: event.id,
				text : event.summary
				}));
              //appendPre(event.summary + " - " + event.id )
            }
          } else {
            appendPre('No upcoming events found.');
          }

        });
      }
	
	  function add1event(todayDate, id, reminderdays) {
		  if(!todayDate.isValid()) {
			 alert("Date " + todayDate.format()  + "is not valid");
		  }
	   var remindDate = moment(todayDate).subtract(reminderdays,'days');
	   var nextDate = moment(todayDate).subtract(reminderdays,'days').add(15,'minutes');

		//nextDate.setDate(nextDate.getDate() + 2);
	   console.log(todayDate);
	   console.log(nextDate);
        var event = {
		  'summary': 'Book Train Ticket for ' + todayDate.format("LL"),
		  'location': 'www.irctc.co.in',
		  'description': 'Book tickets for travel on ' + todayDate.format("LL"),
		  'start': {
		  	'dateTime': remindDate.format(),
			//'dateTime': '2015-05-28T09:00:00-07:00',
			//'timeZone': 'America/Los_Angeles'
		  },
		  'end': {
			'dateTime': nextDate.format(),
			//'dateTime': '2015-05-28T17:00:00-07:00',
			//'timeZone': 'America/Los_Angeles'
		  },
		 // 'recurrence': [
		//	'RRULE:FREQ=DAILY;COUNT=2'
		//  ],
		//  'attendees': [
		//	{'email': 'lpage@example.com'},
		//	{'email': 'sbrin@example.com'}
		 // ],
		  'reminders': {
			'useDefault': false,
			'overrides': [
			//TODO in user control.
			  {'method': 'email', 'minutes': 24 * 60},
			  {'method': 'popup', 'minutes': 12 * 60},
			  {'method': 'popup', 'minutes': 30},
			  {'method': 'popup', 'minutes': 10},
			]
		  }
		};

		var request = gapi.client.calendar.events.insert({
		  'calendarId': id,
		  'resource': event
		});

		request.execute(function(event) {
		console.log(event);
		  appendPre('Event created: ' + event.htmlLink);
		});
      }
	  
      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
      function listUpcomingEvents() {
        var request = gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        });

        request.execute(function(resp) {
          var events = resp.items;
          appendPre('Upcoming events:');

          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var event = events[i];
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
              appendPre(event.summary + ' (' + when + ')')
            }
          } else {
            appendPre('No upcoming events found.');
          }

        });
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message) {
        var pre = document.getElementById('output');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }

