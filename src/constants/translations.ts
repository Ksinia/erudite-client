export const TRANSLATIONS: { [key: string]: { [key: string]: string } } = {
  en_US: {
    create_room: 'Please create a new room or enter an existing room.',
    toolbar_list: 'List of games',
    toolbar_rules: 'Rules',
    welcome: 'Welcome',
    log_in: 'Log in',
    log_out: 'Log out',
    sign_up: 'Sign up',
    qty: 'Please specify the quantity of players: ',
    submit: 'Submit',
    your_turn_games: 'Your turn',
    your_other_games: 'Your other games',
    your_rooms: 'Your rooms',
    available_rooms: 'Available rooms',
    other_rooms: 'Other rooms',
    room: 'Room',
    game: 'Game',
    your_turn: 'Your turn!',
    waiting: 'Waiting for players',
    ready: 'Ready for the game',
    of: 'of',
    players_in_game: 'players in the game',
    players: 'Players:',
    play_again: 'Play again with the same players',
    confirm: 'Confirm',
    pass: 'Pass',
    return: 'Return letters',
    change: 'Pass and change all letters',
    i_confirm: "I confirm {}'s turn",
    undo: 'Undo my last move',
    no: "I disagree with the last {}'s move",
    disagree: "{} doesn't agree with the last {}'s move",
    validation: "Validation of {}'s turn",
    turn_of: "{}'s turn",
    game_over: 'Game over',
    player: 'Player',
    score: 'Score',
    results: 'Detailed game results:',
    winner: 'The winner',
    longest_word: 'The longest word',
    valuable_word: 'The most valuable word',
    max_words: 'The maximum words in one turn',
    valuable_turn: 'The most valuable turn',
    never_changed: 'Never changed letters',
    turn: 'Turn',
    turns: 'Game turns',
    passed: 'passed',
    changed: 'changed letters',
    loading: 'Loading...',
    players_in_room: 'Players already in the room:',
    room_for: 'Room {} for {} players',
    start: 'Start game',
    join: 'Join the game',
    no_players: 'No players in this room',
    please_log_in: 'Please log in to join the game',
    waiting_for: 'Waiting for {} more players',
    no_room: 'No such room',
    no_game: 'No such game',
    letters: 'Letters left in the bag: ',
    already_signed_up: 'Already have an account? Log in',
    no_account: "Don't have an account? Sign Up",
    password: 'Password',
    name: 'Name',
    word: 'word',
    letter: 'letter',
    language: 'Choose letters set: ',
    forgot: 'Forgot password?',
    select: 'Please select a letter for *',
    duplicated: 'Cannot confirm this turn. Duplicated words: {}',
    finished: 'Your finished games',
    archived: 'Your archived games',
    to_validate: 'Words to be validated: {}',
    expand_archived: 'Expand archived games',
    expand_finished: 'Expand finished games',
    collapse_archived: 'Collapse archived games',
    collapse_finished: 'Collapse finished games',
    please_login: 'Please log in or sign up',
    link_generated:
      'The link for changing password was created. Please email Ksenia at xsenia.gulyaeva@gmail.com to get the link. The link expires after 1 hour',
    link_sent:
      'The link for changing password was sent to your email. The link expires after 1 hour',
    enter_name: 'Please enter your name to receive password change link',
    enter_new_password: 'Please enter your new password',
    change_password: 'Password change',
    password_changed: 'Password successfully changed',
    email: 'Email',
    rules: `Rules of the Game
    
      Between 2 to 8 players can participate in the game. 
      
      The winner is the one who scores the most points. 
      
      Words are formed only horizontally or vertically and must be read from left to right or from top to bottom.
      Multiple words can be formed in one turn from the seven available letters.
      New words cannot be formed on free space without any connection to the previous words.
      The first word is placed horizontally or vertically so that one of its letters is on the central square of the board.
      
      The score for each turn consists of the sum of the points earned for each letter used, as well as bonuses received for placing letters on bonus squares.
      Bonus squares for letters: the score for a letter placed on a green square is doubled, and on a orange square, tripled.
      Bonus squares for words: if one of the letters in a word is placed on a blue square, the total score for the entire word is doubled, and on a red square, tripled.
      If the letters of a word are simultaneously placed on both bonus letter and word squares, the letter bonus is calculated first, followed by the word bonus.
      The bonus for a letter and a word is only awarded to the player who first occupies the bonus squares.
      Each player who uses all seven letters in one turn receives an additional bonus of 15 points.
      
      The wildcard symbol * can be used to represent any letter.
      A player can take the wildcard symbol from the board by replacing it with the corresponding letter and using it in the same turn. Points are not awarded for the letter represented by the wildcard symbol.
      
      The game ends when all participants skip their turn without replacing letters twice in a row.
      
      The rules of the game can be changed by mutual agreement between the participants.`,
  },
  ru_RU: {
    create_room: 'Пожалуйста, создайте комнату или войдите в существующую',
    toolbar_list: 'Список игр',
    toolbar_rules: 'Правила',
    welcome: 'Привет,',
    log_in: 'Войти',
    log_out: 'Выйти',
    sign_up: 'Зарегистрироваться',
    qty: 'Пожалуйста, укажите количество игроков: ',
    submit: 'Создать',
    your_turn_games: 'Ваш ход',
    your_other_games: 'Другие ваши игры',
    your_rooms: 'Ваши комнаты',
    available_rooms: 'Доступные комнаты',
    other_rooms: 'Другие комнаты',
    room: 'Комната',
    game: 'Игра',
    your_turn: 'Ваш ход!',
    waiting: 'Ожидание игроков',
    ready: 'Можно начать игру',
    of: 'из',
    players_in_game: 'игроков в игре',
    players: 'Игроки:',
    play_again: 'Сыграть еще раз в том же составе',
    confirm: 'Подтвердить',
    pass: 'Пропустить ход',
    return: 'Вернуть буквы',
    change: 'Пропустить ход и заменить все буквы',
    i_confirm: 'Я подтверждаю ход игрока {}',
    undo: 'Отменить мой последний ход',
    no: 'Я не соглашаюсь с последним ходом {}',
    disagree: '{} не соглашается с последним ходом {}',
    validation: 'Проверка хода игрока {}',
    turn_of: 'Ход игрока {}',
    game_over: 'Игра окончена',
    player: 'Игрок',
    score: 'Счет',
    results: 'Подробные результаты игры:',
    winner: 'Победитель',
    longest_word: 'Самое длинное слово',
    valuable_word: 'Самое дорогое слово',
    max_words: 'Масимум слов за один ход',
    valuable_turn: 'Самый дорогой ход',
    never_changed: 'Без замены букв',
    turn: 'Ход',
    turns: 'Ходы',
    passed: 'пас',
    changed: 'замена букв',
    loading: 'Загрузка...',
    players_in_room: 'Игроки в этой комнате:',
    room_for: 'Комната {} на {} игроков',
    start: 'Начать игру',
    join: 'Присоединиться к игре',
    no_players: 'В этой комнате нет игроков',
    please_log_in: 'Пожалуйста, залогиньтесь, чтобы присоединиться к игре',
    waiting_for: 'Ожидание еще {} игроков',
    no_room: 'Нет комнаты с таким номером',
    no_game: 'Нет игры с таким номером',
    letters: 'Осталось букв: ',
    already_signed_up: 'Уже есть аккаунт? Войдите',
    no_account: 'Нет аккаунта? Зарегистрируйтесь',
    password: 'Пароль',
    name: 'Имя',
    word: 'слово',
    letter: 'буква',
    language: 'Выберите набор букв: ',
    forgot: 'Забыли пароль?',
    select: 'Пожалуйста, выберите букву для *',
    duplicated: 'Нельзя подтвердить ход. Повторяющиеся слова: {}',
    finished: 'Ваши законченные игры',
    archived: 'Ваши архивные игры',
    to_validate: 'Слова для подтверждения: {}',
    expand_archived: 'Развернуть архивные игры',
    expand_finished: 'Развернуть завершенные игры',
    collapse_archived: 'Cвернуть архивные игры',
    collapse_finished: 'Cвернуть завершенные игры',
    please_login: 'Пожалуйста, войдите или зарегистрируйтесь',
    link_generated:
      'Ссылка для смены пароля сгенерирована. Пожалуйста, свяжитесь с Ксенией по адресу xsenia.gulyaeva@gmail.com для получения ссылки. Ссылка действительна в течение часа',
    link_sent:
      'Ссылка для смены пароля выслана на ваш email. Ссылка действительна в течение часа',
    enter_name:
      'Пожалуйста, введите ваше имя, чтобы получить ссылку для смены пароля',
    enter_new_password: 'Пожалуйста, введите новый пароль',
    change_password: 'Смена пароля',
    password_changed: 'Пароль успешно изменен',
    email: 'Почта',
    rules: `Правила игры
    
      В игре принимают участие от 2 до 8 человек. 
      
      Побеждает тот, кто наберет наибольшее количество очков. 
      
      Слова составляются только по вертикали или горизонтали и должны читаться слева-направо или сверху-вниз.      
      За один ход можно составить несколько слов из имеющихся 7 букв.
      Нельзя составлять новые слова на свободном поле без увязки с предыдущими словами.    
      Первое слово располагают горизонтально или вертикально так, чтобы одна из его букв пришлась на центральную клетку поля.
      
      Сумма очков каждого хода состоит из суммы очков составленных букв, а также премий, получаемых за размещение букв на премиальных клетках.
      Премиальные клетки для букв: очки буквы, расположенной на зеленой клетке, удваиваются, на оранжевой - утраиваются.
      Премиальные клетки для слов: если одна из букв слова расположена на синей клетке, сумма очков всего слова удваивается, на красной – утраивается.
      Если буквы слова одновременно расположены на премиальных клетках букв и слов, сначала подсчитывается премия за букву, потом - за слово.
      Премия за букву и слово засчитывается лишь тому игроку, который первым сумел занять премиальные клетки.
      Каждый игрок, использовавший за один ход все 7 букв, получает дополнительную премию в 15 очков.
      
      Универсальный символ * (звездочка) может принимать значение любой буквы.
      Игрок может забрать звездочку с поля, заменив ее на соответствующую букву, и использовать в этот же ход.
      Очки за букву, которую обозначает звездочка, не начисляются.
      
      Игра заканчивается, когда все участники пропустят ход без замены букв по 2 раза подряд.
      
      Правила игры могут меняться по договоренности участников.`,
  },
};
export const LANG_NAMES: { locale: string; name: string }[] = [
  { locale: 'en_US', name: 'EN' },
  { locale: 'ru_RU', name: 'RU' },
];
