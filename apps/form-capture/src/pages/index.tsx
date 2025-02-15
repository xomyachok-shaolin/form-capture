import React, { useState, useEffect, FormEvent } from 'react';

interface Rules {
  budget_from: number;
  budget_to: number;
  deadline_days: number;
  qty_freelancers: number;
}

export default function Home() {
  // -------------------------
  // Состояния для полей формы
  // -------------------------
  // Храним token в localStorage (только его)
  const [token, setToken] = useState('');

  // Поля, которые *не* сохраняем в localStorage
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [budgetFrom, setBudgetFrom] = useState(1000);
  const [budgetTo, setBudgetTo] = useState(5000);
  const [deadline, setDeadline] = useState(1);
  const [reminds, setReminds] = useState(3);
  const [allAutoResponses, setAllAutoResponses] = useState(false);

  // Для поля rules: создадим отдельные поля, потом склеим в JSON
  const [rulesBudgetFrom, setRulesBudgetFrom] = useState(5000);
  const [rulesBudgetTo, setRulesBudgetTo] = useState(8000);
  const [rulesDeadlineDays, setRulesDeadlineDays] = useState(5);
  const [rulesQtyFreelancers, setRulesQtyFreelancers] = useState(1);

  // ----------------------------------------------------------------
  // При монтировании читаем token из localStorage (если он там есть)
  // ----------------------------------------------------------------
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // ----------------------------------------------------------------
  // Следим за изменениями token и сохраняем его в localStorage
  // ----------------------------------------------------------------
  useEffect(() => {
    if (token.trim() !== '') {
      localStorage.setItem('token', token);
    }
  }, [token]);

  // ----------------------------------------------------------------
  // Обработка отправки формы
  // ----------------------------------------------------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Собираем объект rules из отдельных полей
    const rules: Rules = {
      budget_from: rulesBudgetFrom,
      budget_to: rulesBudgetTo,
      deadline_days: rulesDeadlineDays,
      qty_freelancers: rulesQtyFreelancers,
    };

    // Подготовим query-параметры
    const queryParams = new URLSearchParams({
      token,
      title,
      description,
      tags,
      budget_from: budgetFrom.toString(),
      budget_to: budgetTo.toString(),
      deadline: deadline.toString(),
      reminds: reminds.toString(),
      all_auto_responses: allAutoResponses.toString(),
      rules: JSON.stringify(rules),
    });

    // Ваш эндпоинт
    const baseUrl = 'https://deadlinetaskbot.productlove.ru/api/v1/tasks/client/newhardtask';

    try {
      const response = await fetch(`${baseUrl}?${queryParams}`, {
        method: 'GET', // или 'POST' – но вы дали GET-ссылку, поэтому оставляем GET
      });

      if (response.ok) {
        alert('Задача опубликована!');
      } else {
        alert(`Ошибка публикации. Код ответа: ${response.status}`);
      }
    } catch (error) {
      alert(`Произошла ошибка при запросе: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <h1 className="text-2xl font-bold mb-4">Создание задачи</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl p-6 bg-white rounded shadow-md"
      >
        {/* TOKEN */}
        <label className="block mb-4">
          <span className="block mb-1 font-semibold">Token</span>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Введите token (сохранится в localStorage)"
            required
          />
        </label>

        {/* Title */}
        <label className="block mb-4">
          <span className="block mb-1 font-semibold">Title</span>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название задачи"
            required
          />
        </label>

        {/* Description */}
        <label className="block mb-4">
          <span className="block mb-1 font-semibold">Description</span>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание задачи"
            rows={3}
            required
          />
        </label>

        {/* Tags */}
        <label className="block mb-4">
          <span className="block mb-1 font-semibold">Tags (через запятую)</span>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Пример: вб, дизайн, фигма"
          />
        </label>

        {/* Budget from / to */}
        <div className="flex gap-4 mb-4">
          <label className="flex-1">
            <span className="block mb-1 font-semibold">Budget (от)</span>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={budgetFrom}
              onChange={(e) => setBudgetFrom(Number(e.target.value))}
              placeholder="1000"
            />
          </label>
          <label className="flex-1">
            <span className="block mb-1 font-semibold">Budget (до)</span>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={budgetTo}
              onChange={(e) => setBudgetTo(Number(e.target.value))}
              placeholder="5000"
            />
          </label>
        </div>

        {/* Deadline */}
        <label className="block mb-4">
          <span className="block mb-1 font-semibold">Deadline (дней)</span>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={deadline}
            onChange={(e) => setDeadline(Number(e.target.value))}
            placeholder="1"
          />
        </label>

        {/* Reminds */}
        <label className="block mb-4">
          <span className="block mb-1 font-semibold">Reminds</span>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={reminds}
            onChange={(e) => setReminds(Number(e.target.value))}
            placeholder="3"
          />
        </label>

        {/* All_auto_responses */}
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            className="mr-2"
            checked={allAutoResponses}
            onChange={(e) => setAllAutoResponses(e.target.checked)}
          />
          <span className="font-semibold">All Auto Responses</span>
        </label>

        {/* RULES — поля для формирования JSON */}
        <p className="font-bold mb-2">Rules (будут собраны в JSON)</p>
        <div className="flex gap-4 mb-4">
          <label className="flex-1">
            <span className="block mb-1 font-semibold">rules.budget_from</span>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={rulesBudgetFrom}
              onChange={(e) => setRulesBudgetFrom(Number(e.target.value))}
            />
          </label>
          <label className="flex-1">
            <span className="block mb-1 font-semibold">rules.budget_to</span>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={rulesBudgetTo}
              onChange={(e) => setRulesBudgetTo(Number(e.target.value))}
            />
          </label>
        </div>
        <div className="flex gap-4 mb-4">
          <label className="flex-1">
            <span className="block mb-1 font-semibold">
              rules.deadline_days
            </span>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={rulesDeadlineDays}
              onChange={(e) => setRulesDeadlineDays(Number(e.target.value))}
            />
          </label>
          <label className="flex-1">
            <span className="block mb-1 font-semibold">
              rules.qty_freelancers
            </span>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={rulesQtyFreelancers}
              onChange={(e) =>
                setRulesQtyFreelancers(Number(e.target.value))
              }
            />
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
        >
          Опубликовать задачу
        </button>
      </form>
    </div>
  );
}
