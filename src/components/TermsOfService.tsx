import React, { FunctionComponent } from 'react';

const TermsOfService: FunctionComponent = () => {
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
      <h1>Terms of Service / Условия использования</h1>
      <p>Last updated / Последнее обновление: 25.02.2026</p>

      <hr />

      <h2>Acceptance of Terms</h2>
      <p>
        By creating an account or using Эрудит, you agree to these Terms of
        Service. If you do not agree, please do not use the app.
      </p>

      <h2>Account Registration</h2>
      <p>
        You must provide a username, email address, and password to create an
        account. You are responsible for maintaining the security of your
        account credentials. You may not use another person&apos;s account
        without permission.
      </p>

      <h2>User-Generated Content</h2>
      <p>
        Эрудит includes an in-game chat feature. You are solely responsible for
        the content you post. You agree not to post content that is:
      </p>
      <ul>
        <li>Offensive, abusive, or harassing</li>
        <li>Illegal or promotes illegal activity</li>
        <li>Spam or unsolicited advertising</li>
        <li>Infringing on the rights of others</li>
      </ul>

      <h2>Content Moderation</h2>
      <p>
        Users can report offensive messages and block other users. Reported
        content is reviewed by the app administrator. We reserve the right to
        remove content or suspend accounts that violate these terms.
      </p>

      <h2>Account Termination</h2>
      <p>
        You may delete your account at any time from the profile page. We may
        also suspend or terminate accounts that violate these terms.
      </p>

      <h2>Disclaimer</h2>
      <p>
        Эрудит is provided &ldquo;as is&rdquo; without warranty of any kind. We
        do not guarantee uninterrupted or error-free service.
      </p>

      <h2>Contact</h2>
      <p>
        If you have any questions about these terms, please contact Ksenia
        Gulyaeva at{' '}
        <a href="mailto:xsenia.gulyaeva@gmail.com">xsenia.gulyaeva@gmail.com</a>
        .
      </p>

      <hr />

      <h2>Принятие условий</h2>
      <p>
        Создавая аккаунт или используя Эрудит, вы соглашаетесь с настоящими
        Условиями использования. Если вы не согласны, пожалуйста, не используйте
        приложение.
      </p>

      <h2>Регистрация аккаунта</h2>
      <p>
        Для создания аккаунта необходимо указать имя пользователя, адрес
        электронной почты и пароль. Вы несёте ответственность за сохранность
        данных вашего аккаунта. Запрещается использовать чужой аккаунт без
        разрешения.
      </p>

      <h2>Пользовательский контент</h2>
      <p>
        В Эрудит есть внутриигровой чат. Вы несёте полную ответственность за
        публикуемый контент. Запрещается публиковать контент, который:
      </p>
      <ul>
        <li>Оскорбительный или содержит угрозы</li>
        <li>Незаконный или пропагандирует незаконную деятельность</li>
        <li>Является спамом или нежелательной рекламой</li>
        <li>Нарушает права других лиц</li>
      </ul>

      <h2>Модерация контента</h2>
      <p>
        Пользователи могут жаловаться на оскорбительные сообщения и блокировать
        других пользователей. Жалобы рассматриваются администратором приложения.
        Мы оставляем за собой право удалять контент или приостанавливать
        действие аккаунтов, нарушающих настоящие условия.
      </p>

      <h2>Удаление аккаунта</h2>
      <p>
        Вы можете удалить свой аккаунт в любое время на странице профиля. Мы
        также можем приостановить или удалить аккаунты, нарушающие настоящие
        условия.
      </p>

      <h2>Отказ от ответственности</h2>
      <p>
        Эрудит предоставляется «как есть» без каких-либо гарантий. Мы не
        гарантируем бесперебойную или безошибочную работу сервиса.
      </p>

      <h2>Контакты</h2>
      <p>
        Если у вас есть вопросы по настоящим условиям, свяжитесь с Ксенией
        Гуляевой:{' '}
        <a href="mailto:xsenia.gulyaeva@gmail.com">xsenia.gulyaeva@gmail.com</a>
        .
      </p>
    </div>
  );
};

export default TermsOfService;
