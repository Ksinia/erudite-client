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
      <h1>Privacy Policy / Политика конфиденциальности</h1>
      <p>Last updated / Последнее обновление: 15.02.2026</p>

      <hr />

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

      <hr />

      <h2>Какие данные мы собираем</h2>
      <p>
        При создании аккаунта мы собираем ваше имя пользователя, адрес
        электронной почты и пароль. Пароль хранится в зашифрованном виде и
        недоступен для чтения.
      </p>
      <p>
        Во время игр мы сохраняем игровые данные: состояние поля, ходы, очки и
        сообщения чата.
      </p>

      <h2>Как мы используем ваши данные</h2>
      <ul>
        <li>Ваше имя пользователя отображается другим игрокам во время игр.</li>
        <li>
          Адрес электронной почты используется для отправки ссылок на сброс
          пароля и подтверждения смены почты. Мы не отправляем рекламные письма.
        </li>
        <li>
          Игровые данные используются для работы игры и отображения истории
          ваших игр.
        </li>
      </ul>

      <h2>Push-уведомления</h2>
      <p>
        Если вы включите push-уведомления, мы сохраним токен вашего устройства,
        чтобы уведомлять вас об игровых событиях, например когда наступает ваш
        ход. Вы можете отключить уведомления в любое время в настройках
        устройства.
      </p>

      <h2>Передача данных</h2>
      <p>
        Мы не продаём, не обмениваем и не передаём ваши персональные данные
        третьим лицам. Мы не используем сторонние сервисы аналитики или
        отслеживания.
      </p>

      <h2>Хранение данных</h2>
      <p>
        Ваши данные хранятся на защищённом сервере. Мы не передаём ваши данные
        третьим лицам.
      </p>

      <h2>Ваши права</h2>
      <p>
        Вы можете изменить адрес электронной почты и пароль в приложении. Если
        вы хотите удалить свой аккаунт, свяжитесь с нами.
      </p>

      <h2>Контакты</h2>
      <p>
        Если у вас есть вопросы по этой политике конфиденциальности, свяжитесь с
        Ксенией Гуляевой:{' '}
        <a href="mailto:xsenia.gulyaeva@gmail.com">xsenia.gulyaeva@gmail.com</a>
        .
      </p>
    </div>
  );
};

export default PrivacyPolicy;
