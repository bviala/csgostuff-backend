# CSGOStuff
The goal of this application is to provide Counter-Strike Global Offensive (CSGO) players a place where they can easily learn "stuffs" with GIFs. A "stuff" is a smoke, incendiary or flash grenade thrown in a particular manner to gain advantage on the opponents.

This project features:
- A Vue.js SPA with Vuetify.js as UI framework (csgostuff-frontend repo)
- A GraphQL API built with Node.js (csgostuff-backend repo)
- Google Sign-In implementation
- A voting system for connected users
- A form for connected users to submit new stuffs, with field validation
- Stuff sorting based on their score
- Stuff filtering
- Infinite scrolling

[Live demo here.](kindhearted-battle.surge.sh/#/) The backend uses a free hosting that goes idle when not used, so content will probably take time to load on your first visit.

To this day:
- Not responsive. Will look terrible on mobile.
- GIFs stuttering issue on Windows + Chrome. Seems to work better with Firefox
- Not working on Internet Explorer
