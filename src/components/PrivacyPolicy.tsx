import React, { FunctionComponent } from 'react';

const PrivacyPolicy: FunctionComponent = () => {
  return (
    <div
      style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: 20,
        lineHeight: 1.5,
        fontSize: 14,
        textAlign: 'left',
      }}
    >
      <h1>Privacy Policy</h1>
      <p>Last updated: February 15, 2026</p>

      <h2>What data we collect</h2>
      <p>
        When you create an account, we collect your username, email address, and
        password. Your password is stored in hashed form and cannot be read by
        anyone.
      </p>
      <p>
        When you play games, we store game data including board state, moves,
        scores, and chat messages.
      </p>

      <h2>How we use your data</h2>
      <ul>
        <li>Your username is displayed to other players during games.</li>
        <li>
          Your email address is used to send password reset links and email
          change confirmations. We do not send marketing emails.
        </li>
        <li>
          Game data is used to provide the game functionality and display your
          game history.
        </li>
      </ul>

      <h2>Push notifications</h2>
      <p>
        If you enable push notifications, we store your device push token to
        notify you about game events such as when it is your turn. You can
        disable notifications at any time in your device settings.
      </p>

      <h2>Data sharing</h2>
      <p>
        We do not sell, trade, or share your personal data with third parties.
        We do not use any third-party analytics or tracking services.
      </p>

      <h2>Data storage</h2>
      <p>
        Your data is stored on a secure server. We do not transfer your data to
        third parties.
      </p>

      <h2>Your rights</h2>
      <p>
        You can change your email address and password in the app. If you would
        like to delete your account, please contact us.
      </p>

      <h2>Contact</h2>
      <p>
        If you have any questions about this privacy policy, please contact
        Ksenia Gulyaeva at{' '}
        <a href="mailto:xsenia.gulyaeva@gmail.com">xsenia.gulyaeva@gmail.com</a>
        .
      </p>
    </div>
  );
};

export default PrivacyPolicy;
