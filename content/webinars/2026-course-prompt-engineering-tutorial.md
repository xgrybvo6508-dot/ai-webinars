---
title: "Курс: Prompt Engineering Interactive Tutorial"
company: anthropic
date: 2026-10-16
tags: [курс, промптинг]
speaker: Anthropic Courses (GitHub)
duration: 9 глав + 3 приложения
source: https://github.com/anthropics/courses/tree/master/prompt_engineering_interactive_tutorial
source_label: Курс на GitHub · 13 Jupyter-ноутбуков
lead: Девять глав о промптинге от Anthropic с автопроверкой упражнений — от ясных инструкций до шаблона сложного промпта из десяти элементов.
---

Это главный учебник Anthropic по промптингу. В каждой главе есть урок с примерами и упражнения с автопроверкой на регулярках. Курс работает на Claude 3 Haiku с `temperature` 0, а весь он построен вокруг одной функции `get_completion`, которая отправляет промпт в Messages API. Приложение про tool use описывает старый XML-формат, его стоит читать как историю. Остальное не устарело.

Первая глава напоминает об устройстве запроса. Обязательны `model`, `max_tokens` (жёсткий стоп, может оборвать посреди слова) и `messages`, где `user` и `assistant` чередуются, а первым идёт `user`. Системный промпт живёт отдельно, в параметре `system`, и по курсу помогает модели держаться правил.

> Покажи промпт коллеге. Если он запутался — Claude тоже запутается.

***

Вторая глава — ясность. У Claude нет никакого контекста, кроме того, что ты написал, поэтому с ним стоит говорить как с новым сотрудником. Хочешь хайку без «Here is a haiku»? Так и попроси: «Skip the preamble». Хочешь одного лучшего баскетболиста вместо списка? Скажи, что мнения разные, но выбрать нужно одного. Третья глава — роли. «You are a cat» полностью меняет ответ про скейтбординг, а «You are a logic bot» помогает решить задачу про женатого Джека, смотрящего на Анну. Сами авторы оговариваются: «не совсем по правильным причинам». Полезный бонус — указать ещё и аудиторию.

Четвёртая глава о шаблонах. Неизменный скелет промпта отделяют от переменных и подставляют данные через f-string. Тут подстерегает ловушка: в промпте «Yo Claude. {EMAIL} ...» Claude принял приветствие за часть письма и начал ответ с «Dear Claude». Лечится XML-тегами: `<email>{EMAIL}</email>`. Волшебных имён тегов нет, Claude просто обучен понимать теги как разметку. И мелочи важны: по курсу, модель чаще ошибается, когда ошибаешься ты.

::fig small-steps "Данные — в теги, инструкции — снаружи, вопрос — в конце"

***

Пятая глава — формат ответа. Попроси положить результат в `<haiku>`, и программа его легко вырежет. Ещё сильнее работает prefill: начало ответа кладут в сообщение `assistant` — `<haiku>` или открывающую `{` для JSON. А закрывающий тег в `stop_sequences` экономит время и деньги. Шестая глава — размышления. Ключевая фраза курса: «thinking only counts when it's out loud». Попросить «подумай, но выведи только ответ» бесполезно. Пример — отзыв, где «unrelated news» про жизнь под камнем с 1900 года сбивает Claude с толку. Помогает сначала выписать аргументы за и против в тегах. Там же курс замечает, что в большинстве случаев Claude склонен выбирать второй из двух вариантов.

Седьмая глава — примеры. Few-shot курс называет крайне эффективным приёмом. Одна пара «вопрос — ответ» про зубную фею делает тон «родительского бота» тёплым лучше любых описаний. Восьмая — галлюцинации. Первое средство — дать выход: «отвечай, только если уверен». Второе — сначала доказательства. На длинном отчёте Matterport с отвлекающими цифрами Claude выдумывал число подписчиков. Когда его попросили сначала вытащить релевантную цитату в `<scratchpad>` и проверить, отвечает ли она на вопрос, он заметил, что нет.

> Сначала используй много элементов, чтобы промпт заработал, потом сокращай.

***

Девятая глава собирает всё в шаблон сложного промпта из десяти элементов. Первым идёт роль `user`. Затем контекст задачи и тон, подробные правила с «выходом» на случай незнания, примеры в `<example>` и данные в своих тегах. Ближе к концу — напоминание о немедленной задаче с вопросом внизу, просьба подумать и формат вывода. Завершает prefill. Пример курса — карьерный коуч Joe от AdAstra Careers с prefill `[Joe] <response>`. Затем показан юридический промпт с переставленными блоками: курс подчёркивает, что промптинг — это научный метод проб и ошибок. Приложения добавляют цепочки промптов. Самопроверка «замени ненастоящие слова» требует выхода «если всё верно, верни список как есть», иначе Claude портит правильный ответ. Ещё в приложениях есть старый способ tool use через `<function_calls>` и короткая справка о поиске и RAG.

Как применить. Сделай десятиэлементный шаблон своим стандартом для клиентских ботов. Схема «документ → цитаты → ответ» — готовая услуга «анализ отчётов без выдумок». Классификация писем из шестой и седьмой глав — простое демо для малого бизнеса. А привычка писать к каждому промпту маленькую проверку, как `grade_exercise` в курсе, — первый шаг к настоящим evals.

Главы: [00 How-To](https://github.com/anthropics/courses/blob/master/prompt_engineering_interactive_tutorial/Anthropic%201P/00_Tutorial_How-To.ipynb) · [01 Structure](https://github.com/anthropics/courses/blob/master/prompt_engineering_interactive_tutorial/Anthropic%201P/01_Basic_Prompt_Structure.ipynb) · [02 Clear](https://github.com/anthropics/courses/blob/master/prompt_engineering_interactive_tutorial/Anthropic%201P/02_Being_Clear_and_Direct.ipynb) · [03 Roles](https://github.com/anthropics/courses/blob/master/prompt_engineering_interactive_tutorial/Anthropic%201P/03_Assigning_Roles_Role_Prompting.ipynb) · [04 Data](https://github.com/anthropics/courses/blob/master/prompt_engineering_interactive_tutorial/Anthropic%201P/04_Separating_Data_and_Instructions.ipynb) · [05 Format](https://github.com/anthropics/courses/blob/master/prompt_engineering_interactive_tutorial/Anthropic%201P/05_Formatting_Output_and_Speaking_for_Claude.ipynb) · [06 Thinking](https://github.com/anthropics/courses/blob/master/prompt_engineering_interactive_tutorial/Anthropic%201P/06_Precognition_Thinking_Step_by_Step.ipynb) · [07 Examples](https://github.com/anthropics/courses/blob/master/prompt_engineering_interactive_tutorial/Anthropic%201P/07_Using_Examples_Few-Shot_Prompting.ipynb) · [08 Hallucinations](https://github.com/anthropics/courses/blob/master/prompt_engineering_interactive_tutorial/Anthropic%201P/08_Avoiding_Hallucinations.ipynb) · [09 Complex](https://github.com/anthropics/courses/blob/master/prompt_engineering_interactive_tutorial/Anthropic%201P/09_Complex_Prompts_from_Scratch.ipynb).
