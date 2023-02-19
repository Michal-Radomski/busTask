# busTask

Node Express EJS Stack watchdog app.

## Description

### General Info

Sever-side fetches GTFS data, parses it and provides an API. Client-side controls and displays status of GTFS data.

## Notes

The .env file is not hosted on [GitHub.com](https://github.com).

## Built With

- The Server is written in [TypeScript](https://www.typescriptlang.org),
- [Express](https://expressjs.com) is used to build server-side,
- [EJS](https://ejs.co) is used to generate HTML,
- [Less](https://lesscss.org) and [Bootstrap](https://getbootstrap.com) are used to style the app,
- Client-side script is written in [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript),
- Parsing a binary Protocol Buffer GTFS-realtime data feed into JavaScript objects is performed by
  [gtfs-realtime-bindings](https://www.npmjs.com/package/gtfs-realtime-bindings).

## License

[MIT](https://choosealicense.com/licenses/mit)
