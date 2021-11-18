# Heroku

## Setup

Create an account on [heroku](https://heroku.com).
After signing in create a new app.

![create app](./assets/createNewApp.png)

Select the `Settings` tab and configure the environment variables to connect to your discord bot and server.
![environment variables](./assets/environmentVariables.png)

Connect the application to the [GitHub](https://github.com) code repository.
![connect to github](./assets/connectToGitHub.png)

Deploy the application manually.
![manual deployment](./assets/manualDeployment.png)

Select the `Resources` tab an configure the dynos to run the `worker` command. Edit the `web` dyno and disable it. Edit the `worker` dyno and enable it.
![dyno configuration](./assets/configureDynos.png)

Configure automatic deployments.
![manual deployment](./assets/automaticDeployment.png)
