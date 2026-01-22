import React, { useState, useEffect } from "react";
import "./SprintsPage.css";
import Header from "../../Header/Header";
import open from '../../../assets/open.svg';
import NewSprint from "./NewSprint";
import { sprintsService } from '../../services/sprintsService';

function SprintsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSprintId, setSelectedSprintId] = useState(null);
  const [sprintsData, setSprintsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  // Загружаем данные спринтов
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await sprintsService.getSprints();
      setSprintsData(data);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      setError("Не удалось загрузить данные спринтов");
    } finally {
      setLoading(false);
    }
  };

  const openNewSprint = () => {
    setSelectedSprintId(null);
    setIsOpen(true);
  };

  const openSprintDetails = (sprintId) => {
    setSelectedSprintId(sprintId);
    setIsOpen(true);
  };

  const closeNewSprint = () => {
    setIsOpen(false);
    setSelectedSprintId(null);
  };

  const handleSuccess = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
    loadData(); // Перезагружаем данные после успешного действия
  };

  const handleCompleteSprint = async () => {
    if (!sprintsData?.current_sprint?.id) return;
    
    setLoading(true);
    try {
      await sprintsService.completeSprint(sprintsData.current_sprint.id);
      setMessage("Спринт завершен!");
      loadData();
    } catch (error) {
      setMessage("Ошибка: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Рендер загрузки
  if (loading && !sprintsData) {
    return (
      <div className="projectMainContainer">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Загрузка спринтов...</p>
        </div>
      </div>
    );
  }

  // Рендер ошибки
  if (error || !sprintsData) {
    return (
      <div className="projectMainContainer">
        <Header />
        <div className="error-container">
          <h2>Ошибка</h2>
          <p>{error || 'Данные спринтов не найдены'}</p>
          <button onClick={loadData}>Повторить попытку</button>
        </div>
      </div>
    );
  }

  return (
    <div className="projectMainContainer">
      <Header />
      <div className="uniSection">
        
        {message && (
          <div className="message">
            {message}
          </div>
        )}
        
        <div className="projectHeaderText">
          <h1>Текущий спринт:</h1>
          {sprintsData.current_sprint ? (
            <h1>
              Завершение: {sprintsService.formatDate(sprintsData.current_sprint.estimated_deadline)}
            </h1>
          ) : (
            <h1>Нет активного спринта</h1>
          )}
        </div>
        
        {sprintsData.current_sprint && (
          <div className="uniInnerSection">
            <h1>Цель</h1>
            <p>{sprintsData.current_sprint.goal}</p>
            <h1>Описание</h1>
            <p>{sprintsData.current_sprint.description}</p>
            <button 
              className="doneBtn"
              onClick={handleCompleteSprint}
              disabled={loading}
            >
              {loading ? "Загрузка..." : "Завершить спринт и начать новый"}
            </button>
          </div>
        )}

        <div className="projectHeaderText">
          <h1>Будущие спринты</h1>
          <button 
            className="newSprint"
            onClick={openNewSprint}
            disabled={loading}
          >
            Новый спринт
          </button>
        </div>
        
        <div className="uniInnerSection sprints">
          {sprintsData.future_sprints.length > 0 ? (
            sprintsData.future_sprints.map((sprint) => (
              <div key={sprint.id} className="sprint">
                <p>{sprint.seq}-{sprint.name}</p>
                <button onClick={() => openSprintDetails(sprint.id)}>
                  <img src={open} alt="Открыть" />
                </button>
              </div>
            ))
          ) : (
            <p>Нет запланированных спринтов</p>
          )}
        </div>

        <div className="projectHeaderText">
          <h1>Завершённые спринты</h1>
        </div>
        
        <div className="uniInnerSection sprints">
          {sprintsData.completed_sprints.length > 0 ? (
            sprintsData.completed_sprints.map((sprint) => (
              <div key={sprint.id} className="sprint">
                <p>{sprint.seq}-{sprint.name}</p>
                <button onClick={() => openSprintDetails(sprint.id)}>
                  <img src={open} alt="Открыть" />
                </button>
              </div>
            ))
          ) : (
            <p>Нет завершенных спринтов</p>
          )}
        </div>
      </div>
      
      <NewSprint
        isOpen={isOpen}
        onClose={closeNewSprint}
        sprintId={selectedSprintId}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default SprintsPage;