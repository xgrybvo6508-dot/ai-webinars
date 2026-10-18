---
title: "Курс: Claude API Fundamentals"
company: anthropic
date: 2026-10-16
tags: [курс, api, python]
speaker: Anthropic Courses (GitHub)
duration: 6 уроков
source: https://github.com/anthropics/courses/tree/master/anthropic_api_fundamentals
source_label: Курс на GitHub · 6 Jupyter-ноутбуков
lead: Шесть ноутбуков о том, как говорить с Claude напрямую из Python. Разбираем ключи, формат сообщений, выбор модели, параметры, стриминг и картинки.
---

Этот курс — фундамент, на котором стоит всё остальное. Шесть Jupyter-ноутбуков от Anthropic учат работать с Claude через официальный SDK `anthropic`: от первого запроса до отправки изображений. Одна оговорка сразу: курс писался во времена Claude 3 и 3.5, и в коде используются модели вроде `claude-3-haiku-20240307` и `claude-3-5-sonnet-20240620`. Приёмы не устарели, а имена моделей бери из актуальной документации.

Первый урок про то, как безопасно начать. SDK ставится командой `pip install anthropic` и требует Python 3.7.1 или новее. Ключ создаётся в консоли Anthropic и показывается один раз. Курс настойчиво повторяет, что ключ — это пароль: его кладут в `.env` строкой `ANTHROPIC_API_KEY=...` и загружают через `python-dotenv`. Клиент сам находит переменную, поэтому хватает `client = Anthropic()`, а первый запрос — это `client.messages.create(model=..., max_tokens=1000, messages=[...])`, текст лежит в `response.content[0].text`.

> Claude знает о разговоре только то, что лежит в messages. История и есть контекст.

***

Второй урок — о главном параметре, `messages`. Это список словарей с `role` (`user` или `assistant`) и `content`, роли обязаны чередоваться, а начинается всё с `user`. Нарушишь любое из правил — получишь ошибку API. Отсюда вытекают два мощных приёма. Первый — prefill: если последнее сообщение от `assistant`, Claude продолжит именно его. В курсе это строка «calming mountain air», с которой Claude дописывает хайку. Второй — few-shot через историю. Задача — оценить тональность твита, и вместо длинного разбора нужно одно слово. Для этого в историю кладут несколько пар «твит → `POSITIVE`/`NEGATIVE`», и ответ приходит в том же формате. В ответе API, кроме текста, есть `stop_reason` и `usage` с `input_tokens` и `output_tokens`: по ним считают деньги.

Третий урок учит выбирать модель по трём осям: скорость, способности, цена. В замере авторов Haiku ответил за 1.09 с, а Opus за 7.32 с. На задаче про геометрическое среднее (правильный ответ 18) старшие модели решили 7 из 7, Haiku — 2 из 7. Авторы подчёркивают, что это демонстрация, а не бенчмарк. Стратегия простая: начни с Haiku, заведи свои evals и переходи на модель мощнее, только если тесты показывают, что Haiku не хватает.

::fig small-steps "Начинай с самой дешёвой модели и повышай, только когда это видно по тестам"

***

Четвёртый урок о параметрах. `max_tokens` — жёсткий потолок. При лимите 10 поэма обрывается на «Here is a poem for you: The», и `stop_reason` становится `max_tokens`. Модель о лимите не знает: он только обрезает ответ. `stop_sequences` останавливает генерацию на заданной строке, например на `}` после JSON. Но сама стоп-строка в ответ не попадает, и скобку нужно дописать вручную. `temperature` от 0 до 1 (по умолчанию 1) управляет разнообразием: при 0 Claude трижды назвал планету «Xendor», при 1 — каждый раз по-новому. Курс оговаривает, что даже 0 не гарантирует полной детерминированности. В `system` курс советует держать роль и тон, а подробные инструкции и примеры — в первом `user`-сообщении.

Пятый урок про стриминг. С `stream=True` приходит поток событий, а текст лежит в `content_block_delta` → `event.delta.text`. Главная польза — время до первого токена. В замере с Haiku первый токен пришёл через 0.49 с вместо 4.19 с, но общее время почти не изменилось. Для удобства в SDK есть `client.messages.stream(...)` с `text_stream` и `get_final_message()`.

Шестой урок — vision. `content` становится списком блоков, а картинка передаётся как `{"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": ...}}`. Поддерживаются JPEG, PNG, GIF и WebP. Когда картинок несколько, их стоит подписывать («Image 1:», «Image 2:»). Без подписей Haiku в примере курса описал только последнее фото из трёх. Для точности нужна конкретика, роль эксперта и рассуждение в `<thinking>`. А чтобы превращать слайды в JSON, лучше показать один эталонный пример.

***

Как применить. Собери из курса свой стартовый шаблон: `.env`, клиент и функция-обёртка с `system`, `max_tokens`, `temperature`. Затем сделай консольный чат со стримингом и перенеси его в Telegram — это первый проект для портфолио. Few-shot в истории плюс `stop_sequences` дают ответы, которые легко парсить в автоматизациях. А «картинка → JSON» — это готовая основа под заказы на оцифровку чеков, визиток и слайдов.

Уроки: [01 Getting started](https://github.com/anthropics/courses/blob/master/anthropic_api_fundamentals/01_getting_started.ipynb) · [02 Messages format](https://github.com/anthropics/courses/blob/master/anthropic_api_fundamentals/02_messages_format.ipynb) · [03 Models](https://github.com/anthropics/courses/blob/master/anthropic_api_fundamentals/03_models.ipynb) · [04 Parameters](https://github.com/anthropics/courses/blob/master/anthropic_api_fundamentals/04_parameters.ipynb) · [05 Streaming](https://github.com/anthropics/courses/blob/master/anthropic_api_fundamentals/05_Streaming.ipynb) · [06 Vision](https://github.com/anthropics/courses/blob/master/anthropic_api_fundamentals/06_vision.ipynb).
