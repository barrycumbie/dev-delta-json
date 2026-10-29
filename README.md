# dev-delta-json

CIS 376 teaching lab with isolated examples for local JSON, form input,
`sessionStorage`, and a public API, followed by a combined-profile challenge.

## Run it

Serve this folder with a local static web server, then open its `index.html`.
The app uses `fetch()` for the local JSON file, so opening the file directly as
`file://` may prevent the browser from loading it.

## Teaching steps

1. **Fetch local JSON:** load favorites from [`assets/data/data.json`](assets/data/data.json) and render them.
2. **Read user input:** submit the separate form to build and display a JavaScript object.
3. **Store and retrieve:** save an independent sample object as JSON text, then parse it back from `sessionStorage`.
4. **Fetch an API:** request and display an image from the public Dog CEO API.
5. **Final challenge:** combine user input, a local favorite, and API data into one profile, save it, read it back, and render from stored state.

Each step has a separate control and annotated example. The combined profile is
restored after a refresh in the same tab; **Clear combined profile** removes
only that profile, leaving the Step 3 storage example intact.

The Dog CEO API requires an internet connection.
