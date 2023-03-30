import e = require('express');
import express = require('express');
const router: express.Router = new (express.Router as any)();
import xss from 'xss';
import data from '../data';
import * as utils from '../utils';
const users = data.users;
const appointments = data.appointments;
const discounts = data.discounts;

router
  .route('/')
  .get(async (_, res) => {
    try {
      const appts = await appointments.getAll();
      res.json(appts);
    } catch (e) {
      console.log(e);
      res.status(404).json({ error: e });
    }
  })
  .post(async (req, res) => {
    try {
      const b = req.body;
      const appt = utils.validateAppointment(
        xss(b.customerId),
        xss(b.hairdresserId),
        Number(xss(b.startTime)),
        Number(xss(b.endTime)),
        xss(b.service),
        xss(b.comments),
        Number(xss(b.price))
      );
      if (await appointments.checkAppointment(appt))
        res.json(await appointments.create(appt));
    } catch (e) {
      console.log(e);
      res.status(404).json({ error: e });
    }
  });

// Calendar Route for Date/Time selection
router.get('/calendar', async (req, res) => {
  try {
    if (req.session.user) {
      const foundHairdressers = await users.getAllHairdressers();
      const relevantInformation = [];
      for (let i = 0; i < foundHairdressers.length; i++) {
        relevantInformation.push({
          id: foundHairdressers[i]._id,
          name:
            foundHairdressers[i].firstName +
            ' ' +
            foundHairdressers[i].lastName,
        });
      }

      res.render('calendar', {
        title: 'Calendar',
        hairdressers: relevantInformation,
      });
    } else {
      res.redirect('/');
    }
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .render('error', { title: 'Error', 'error-msg': e, 'error-status': 500 });
  }
});

router.post('/service', async (req, res) => {
  try {
    if (req.session.user) {
      const _id = utils.checkId(
        xss(req.body.hairdressersdrop),
        'hairdresser id'
      );
      utils
        .checkDate(req.body.datetime, 'appointment datetime')
        .toLocaleString();
      const foundHairdresser = await users.getById(xss(_id));
      const listOfDiscounts = await discounts.getAll();
      res.render('service', {
        title: 'Service Page',
        datetime: xss(req.body.datetime),
        hairdresser: {
          name: foundHairdresser.firstName + ' ' + foundHairdresser.lastName,
          id: xss(req.body.hairdressersdrop),
        },
        discount: listOfDiscounts,
      });
    } else {
      res.redirect('/');
    }
  } catch (e) {
    console.log(e);
    res.status(400).render('error', {
      title: 'Error',
      'error-msg': e,
      'error-status': 400,
    });
  }
});

router.post('/finalization', async (req, res) => {
  try {
    if (req.session.user) {
	  const _id = utils.checkId(xss(req.body.hairdresser), 'hairdresser');
      const foundHairdresser = await users.getById(_id);
      const salonistName =
        foundHairdresser.firstName + ' ' + foundHairdresser.lastName;
      const date = new Date(xss(req.body.datetime)).getTime();
      let price = 0;
      if (xss(req.body.service_selection) == 'cutandcolor') {
        price = 80;
      } else if (xss(req.body.service_selection) == 'washandcut') {
        price = 65;
      } else if (xss(req.body.service_selection) == 'coloronly') {
        price = 45;
      } else { 	// If the service_selection is not valid
		  return res.status(400).render('error', {
			  title: 'Error',
			  'error-msg': 'Invalid service selection',
			  'error-status': 400
		  });
	  }
      const listOfDiscounts = await discounts.getAll();
      for (let i = 0; i < listOfDiscounts.length; i++) {
        if (listOfDiscounts[i].name == xss(req.body.discount)) {
          price = price - listOfDiscounts[i].amount;
        }
      }
      const a = new Date(xss(req.body.datetime));
      a.setHours(a.getHours() + 1);
      const timeEnd = a.getTime();
	  let typeService = xss(req.body.service_selection);

	 if (typeService == 'cutandcolor') { 
		  typeService = 'Cut and Color';
	  } else if (typeService == 'coloronly') {
		  typeService = 'Color Only';
	  } else if (typeService == 'washandcut') { 
		  typeService = 'Wash and Cut';
	  } else { 
		return res.status(400).render('error', {
			title: 'Error',
			'error-msg': 'Invalid service selection',
			'error-status': 400
		});
	  }
      const renderedInfo = {
        hairdresserId: xss(req.body.hairdresser),
        hairdresser: salonistName,
        timeLiteralStart: date,
        timeLiteralEnd: timeEnd,
        timeFormat: xss(req.body.datetime),
        comments: xss(req.body.comments),
        service: typeService,
        discount: xss(req.body.discount),
        price: price,
      };
      res.render('finalization', renderedInfo);
    } else {
      res.redirect('/');
    }
  } catch (e) {
    console.log(e);
	res.status(400).render('error', { 
		title: 'Error', 
		'error-msg': e,
		'error-status': 400
	})
    // res.status(404).json({ error: e });
  }
});

router.post('/confirmation', async (req, res) => {
  try {
    if (req.session.user) {
      const b = req.body;
      const appt = utils.validateAppointment(
        req.session.user,
        xss(b.hairdresserId),
        parseFloat(xss(b.timeLiteralStart)),
        parseFloat(xss(b.timeLiteralEnd)),
        xss(b.service),
        xss(b.comments),
        parseFloat(xss(b.price))
      );
      appointments.create(appt);
      res.render('confirmation');
    } else {
      res.redirect('/');
    }
  } catch (e) {
    console.log(e);
    res.status(400).render('error', {
      title: 'Error',
      'error-msg': e,
      'error-status': 400,
    });
  }
});

router.get('/history/:cid', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/');
    }
    // must be authenticated and logged in to view history
    const _id = utils.checkId(req.session.user, 'customer id');
    const usr = await users.getById(_id);
    if (usr.level !== 'hairdresser') {
      const foundAppointments = await appointments.getAllApptsByCustomerId2(
        _id
      );
      // Going to parse the list of appointments to pass stringified data
      const appointmentParser = [];

      // filter out an error message if no appoint history
      if (foundAppointments.length == 0) {
        const noAppointmentsNotif =
          'Hey! You have no previous appointments booked. If you think this is an error, please contact customer support!';
        res.render('custappointhis', {
          noAppointmentsNotif,
          title: 'Appointment History',
        });
      } else {
        for (let i = 0; i < foundAppointments.length; i++) {
          const foundHairdresser = await users.getById(
            foundAppointments[i].hairdresserId
          );
          const salonistName =
            foundHairdresser.firstName + ' ' + foundHairdresser.lastName;
          const startDate = new Date(foundAppointments[i].startTime);
          const endDate = new Date(foundAppointments[i].endTime);
          // date parsing

          /**
           * Get ordinal suffix for number
           * @param {Number} num - number to process
           * @return {string} ordinal suffix of num
           */
          function ordinalSuffixOf(num: number) {
            const j = num % 10;
            const k = num % 100;
            if (j == 1 && k != 11) {
              return num + 'st';
            }
            if (j == 2 && k != 12) {
              return num + 'nd';
            }
            if (j == 3 && k != 13) {
              return num + 'rd';
            }
            return num + 'th';
          }

          const month = startDate.getUTCMonth(); // jan - 0, dec - 11
          const day = startDate.getUTCDate();
          const year = startDate.getUTCFullYear();
          const monthsArr = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ];
          const fullDay =
            monthsArr[month] + ' ' + ordinalSuffixOf(day) + ', ' + year;

          let typeService = foundAppointments[i].service;
          if (typeService == 'haircut') {
            typeService = 'Haircut';
          } else if (typeService == 'cutandcolor') { 
			  typeService = 'Cut and Color';
		  } else if (typeService == 'coloronly') {
			  typeService = 'Color Only';
		  } else if (typeService == 'washandcut') { 
				typeService = 'Wash and Cut';
		  }
          const comments = foundAppointments[i].comments;
          const price = foundAppointments[i].price;

          const thisObj = {
            dateAlone: fullDay,
            hairdresserName: salonistName,
            startTime: startDate,
            endTime: endDate,
            service: typeService,
            comments: comments,
            price: price,
          };
          appointmentParser.push(thisObj);
        }

        res.render('custappointhis', {
          appointmentParser,
          title: 'Appointment History',
        });
      }
    } else {
      const foundAppointments = await appointments.getAllApptsByHairdresserId2(
        _id
      );
      // Going to parse the list of appointments to pass stringified data
      const appointmentParser = [];

      // filter out an error message if no appoint history
      if (foundAppointments.length == 0) {
        const noAppointmentsNotif =
          'Hey! You have no appointments booked. If you think this is an error, please contact customer support!';
        res.render('hdappts', {
          noAppointmentsNotif,
          title: 'Appointment History',
        });
      } else {
        for (let i = 0; i < foundAppointments.length; i++) {
          const foundCustomer = await users.getById(
            foundAppointments[i].customerId
          );
          const customerName =
            foundCustomer.firstName + ' ' + foundCustomer.lastName;
          const startDate = new Date(foundAppointments[i].startTime);
          const endDate = new Date(foundAppointments[i].endTime);
          // date parsing

          /**
           * Get ordinal suffix for number
           * @param {Number} num - number to process
           * @return {string} ordinal suffix of num
           */
          function ordinalSuffixOf(num: number) {
            const j = num % 10;
            const k = num % 100;
            if (j == 1 && k != 11) {
              return num + 'st';
            }
            if (j == 2 && k != 12) {
              return num + 'nd';
            }
            if (j == 3 && k != 13) {
              return num + 'rd';
            }
            return num + 'th';
          }

          const month = startDate.getUTCMonth(); // jan - 0, dec - 11
          const day = startDate.getUTCDate();
          const year = startDate.getUTCFullYear();
          const monthsArr = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ];
          const fullDay =
            monthsArr[month] + ' ' + ordinalSuffixOf(day) + ', ' + year;

          let typeService = foundAppointments[i].service;
          if (typeService == 'haircut') {
            typeService = 'Haircut';
          }
          const comments = foundAppointments[i].comments;
          const price = foundAppointments[i].price;

          const thisObj = {
            dateAlone: fullDay,
            hairdresserName: customerName,
            startTime: startDate,
            endTime: endDate,
            service: typeService,
            comments: comments,
            price: price,
          };
          appointmentParser.push(thisObj);
        }

        res.render('hdappt', {
          appointmentParser,
          title: 'Appointment History',
        });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.post('/check', async (req, res) => {
  try {
    try {
      const _id = xss(req.body.hid);
      utils.checkId(_id, 'hairdresser id');
    } catch (e) {
      console.log(e);
      res.status(404).render('error', {
        title: 'Error',
        'error-msg': e,
        'error-status': 404,
      });
    }
    await appointments.checkAppointmentByDateTimeAndHairdresser(
      xss(req.body.dateStr),
      xss(req.body.hid)
    );

    res.json({ success: true });
  } catch (e) {
    console.log(e);
    res.json({ success: false, error: e });
    // res.status(400).render('calendar', { title: 'Calendar',  error: e });
  }
});

router.route('/:id').get(async (req, res) => {
  try {
    let _id: string = '';
    try {
      _id = utils.checkId(xss(req.params.id), 'appointment');
    } catch (e) {
      return res.status(404).render('error', {
        title: 'Page Not Found',
        'error-msg': e,
        'error-status': 404,
      });
    }
    const appt = await appointments.get(_id);
    res.json(appt);
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

export = router;
