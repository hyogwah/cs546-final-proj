# C'est La Vie

![This is the logo](public/images/Logo.png)

CS_546: Web Dev 1 // Professor Hill // Stevens Institue of Technology // Spring '22

Authors: Jared Kronyak <jkronyak@stevens.edu>; Alice Huston <shuston@stevens.edu>; Eric Song <esong@stevens.edu>; Isaac Miller <imiller1@stevens.edu>

See section E for usage instructions.

<b> A) Overview </b>

Congratulations! This is the first step in your journey towards using our fully functional faux-business of C'est La Vie. Functioning in all ways like a real business, C'est La Vie is Hairsalon with Hairdressers/Barbers located in Hoboken, New Jersey, with a dynamic web app that allows any user to create an account, schedule an appointment, select the type of service, leave a review, and engage with the business!


<b> B) Key Topics/Core Features: </b>

###### - 1. Landing Page: The initial page that the user sees after entering the website. The user can navigate to the Create Account/Sign-in page, the Appointments page, or several sidebar pages.

###### - 2. Calendar Scheduling Page: Contains a calendar view which displays daily appointment availability. The user can select future dates to book on, or navigate month-by-month. Availability is color-coded.

###### - 3. Service Booking Page: After selecting a valid date on the calendar page, the user can view available time slots on that day. The user can also select from several services, each with their own associated price and duration.

###### - 4. Appointment Finalization Page: After selecting a valid date and time slot, the user will finalize their appointment. They will be able to login (if they have not already done so) or create an account and confirm their appointment.

###### - 5. Reviews Page: Users who have made accounts can leave a review, consisting of a title, comments body, and numeric rating. This page will also include sorting/searching by rating or specific hairdresser.

###### - 6. Contact/About Page: A simple page which contains information about the salon, including address, open hours, and a map of the salon’s location.

###### - 7. Log In & Registration Page: Page for the user to log in and access their account. This page will also let a user register for the site.

###### - 8. Hairdresser/Administrator Log In: Allows salon employees/managers/etc to login to accounts with special permissions. Hairdressers can view their upcoming appointments, view analytics, etc.

###### - 9. Customer Appointment History: Allows customers to view upcoming appointments as well as past appointments and their services.

###### - 10. Hairdresser Profiles: A series of profile pages for the salon’s hairdressers. Would include their name, short biography, and reviews. The user would be able to view availability/book with each hairdresser on their respective profiles. Could work with the Hairdresser/Administrator login to allow hairdressers to modify their profiles at will.


<b> C) Extra Features: </b>

###### - 1. QR Code: A QR code to allow someone to directly link to the website.

###### - 2. Allows businesses to give credits or discounts to customers on an absolute (ex. $5 off haircuts in March) or a repeating (ex. get 5 haircuts, get the next one half off) basis.


<b> D) Steps to Use </b>


- [ ] After arriving on the landing page, the C'est La Vie homepage, with the option to (1) register (2) log in (3) about (4) contact (5) reviews. If you're a returning user click on log in, where you'll be redirected to log in with your credentials (email & password) and click submit. Otherwise, if you're a new user, please sign up 💇 💇‍♀️
- [ ] Upon logging in you will have the ability to select a day from the calendar (based on the business hours/dates) and book a time.
- [ ] After selecting a time, you will have the ability to select a service to book, with the specified Hairdresser, shown with the requisite pricing.
- [ ] Once you have selected your booking information (day, time, and service) you will be redirected to the Appointment Finalization page :tada:
- [ ] A user who books an appointment will have the ability to leave a review. This review will be shown on the 'Reviews' page.
- [ ] A user who is navigating the site will also have the ability to navigate to the About page, where they can learn about C'est La Vie or any of the Hairdresssers.
- [ ] Additionally, a user who is navigating the site will have the ability to navigate to the Contact page, where they can view the business location, the hours of operation, and business details.

<b> E) How to Run </b>

The following lines will install any dependencies, seed the database, and start the server. This assumes that you already have an instance of MongoDB running. Please check seed script (src/tasks/seed.ts) for credentials.

```sh
npm install
npm run seed
npm start
```



©2022
