
  # ResQMeal Web Application Design

  This is a code bundle for ResQMeal Web Application Design. The original project is available at https://www.figma.com/design/q47KpitCbAVSBvJHdcQhRi/ResQMeal-Web-Application-Design.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Password recovery email

  Password reset links are sent by SMTP. Configure these variables in the backend environment before using Forgot Password:

  - `SMTP_HOST`: SMTP server hostname
  - `SMTP_PORT`: SMTP port (defaults to `587`)
  - `SMTP_SECURE`: set to `true` when the provider requires implicit TLS
  - `SMTP_USER` and `SMTP_PASS`: SMTP credentials, when required by the provider
  - `SMTP_FROM`: verified sender address, for example `ResQMeal <no-reply@example.com>`
  - `APP_URL`: public frontend origin used in reset links (defaults to `http://localhost:5173`)

  Never commit SMTP credentials. Reset links expire after 30 minutes and can only be used once. The database creates the reset-token table on server startup.
  