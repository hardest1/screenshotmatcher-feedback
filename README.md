# screenshotmatcher-feedback
Feedback server for screenshotmatcher

### Setup
Create a .env file in the app root dir and set the following parameters:
```sh
FEEDBACK_SECRET=[SECRET]
FEEDBACK_USER=[HTTP_BASIC_AUTH_USERNAME]
FEEDBACK_PASSWORD=[HTTP_BASIC_AUTH_PASSWORD]
FEEDBACK_PORT_HTTP=[HTTP_PORT]
FEEDBACK_PORT_HTTPS=[HTTPS_PORT]
```