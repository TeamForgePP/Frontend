import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./ProjectPage.css";
import Header from "../../Header/Header";
import ProjectComandEdit from "../../Main/Project/ProjectComandEdit";
import Report from "./Report";
import UniPopUp from "../../UniPopUp";
import AddStudents from "./addStudents";
import NewReport from "./NewReport";
import { projectService } from "../../services/projectService";

function ProjectPage() {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [isDeletePopUpOpen, setIsDeletePopUpOpen] = useState(false);
  const [isDonePopUpOpen, setIsDonePopUpOpen] = useState(false);
  const [isReportPopUpOpen, setIsReportPopUpOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    project_name: "",
    git: "",
    description: "",
    team: []
  });
  const [isAddStudentsOpen, setIsAddStudentsOpen] = useState(false);
  const [deletedMembers, setDeletedMembers] = useState([]);
  const [invitedMembers, setInvitedMembers] = useState([]);
  
  const [team, setTeam] = useState([]);

  // Загрузка данных проекта
  const loadProjectData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await projectService.getProjectInfo(projectId);
      
      setProjectData(data);
      
      const teamFormatted = data.team?.map(member => ({
        id: member.id,
        name: member.first_name || member.name,
        surname: member.last_name || member.surname,
        role: Array.isArray(member.roles) ? member.roles.join(', ') : member.role,
        roles: member.roles || []
      })) || [];
      
      setEditForm({
        project_name: data.project_name,
        git: data.git || "",
        description: data.description || "",
        team: teamFormatted
      });
      
      setTeam(teamFormatted);
      
    } catch (err) {
      console.error('Ошибка загрузки проекта:', err);
      setError('Не удалось загрузить данные проекта');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadProjectData();
  }, [loadProjectData]);

  // Включение/выключение режима редактирования
  const handleEditToggle = () => {
    if (!isEditing) {
      setIsEditing(true);
      setDeletedMembers([]);
      setInvitedMembers([]);
    } else {
      setIsEditing(false);
      if (projectData) {
        const teamFormatted = projectData.team?.map(member => ({
          id: member.id,
          name: member.first_name || member.name,
          surname: member.last_name || member.surname,
          role: Array.isArray(member.roles) ? member.roles.join(', ') : member.role,
          roles: member.roles || []
        })) || [];
        
        setEditForm({
          project_name: projectData.project_name,
          git: projectData.git || "",
          description: projectData.description || "",
          team: teamFormatted
        });
        setTeam(teamFormatted);
      }
    }
  };

  const handleDeleteReport = async (reportId) => {
    try {
        setLoading(true);
        await projectService.deleteReport(reportId);
        await loadProjectData();
    } catch (err) {
        console.error('Ошибка удаления отчета:', err);
    } finally {
        setLoading(false);
    }
  };

  // Сохранение изменений
  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      
      const editData = {
        project_id: projectId,
        project_name: editForm.project_name,
        git: editForm.git,
        description: editForm.description,
        deleted: deletedMembers.map(id => ({ id })),
        invited: invitedMembers.map(member => ({
          id: member.id,
          roles: member.roles || [member.role]
        }))
      };
      
      await projectService.editProject(editData);
      
      await loadProjectData();
      setIsEditing(false);
      setDeletedMembers([]);
      setInvitedMembers([]);
      
    } catch (err) {
      console.error('Ошибка сохранения:', err);
    } finally {
      setLoading(false);
    }
  };

  // Отмена редактирования
  const handleCancelEdit = () => {
    if (projectData) {
      const teamFormatted = projectData.team?.map(member => ({
        id: member.id,
        name: member.first_name || member.name,
        surname: member.last_name || member.surname,
        role: Array.isArray(member.roles) ? member.roles.join(', ') : member.role,
        roles: member.roles || []
      })) || [];
      
      setEditForm({
        project_name: projectData.project_name,
        git: projectData.git || "",
        description: projectData.description || "",
        team: teamFormatted
      });
      setTeam(teamFormatted);
    }
    setIsEditing(false);
    setDeletedMembers([]);
    setInvitedMembers([]);
  };

  // Обработчики для полей ввода
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Удаление участника
  const handleRemoveMember = async (memberId) => {
    try {
      setDeletedMembers(prev => [...prev, memberId]);
      setEditForm(prev => ({
        ...prev,
        team: prev.team.filter(member => member.id !== memberId)
      }));
      setTeam(prev => prev.filter(member => member.id !== memberId));
    } catch (err) {
      console.error('Ошибка удаления участника:', err);
    }
  };

  // Обновление участника
  const handleUpdateMember = (memberId, updates) => {
    setEditForm(prev => ({
      ...prev,
      team: prev.team.map(member => 
        member.id === memberId ? { ...member, ...updates } : member
      )
    }));
    setTeam(prev => prev.map(member => 
      member.id === memberId ? { ...member, ...updates } : member
    ));
  };

  // Обновление команды
  const handleTeamUpdate = useCallback((updatedTeam) => {
    setEditForm(prev => ({
      ...prev,
      team: updatedTeam
    }));
  }, []);

  // Обработчики для отчетов
  const openNewReport = () => {
    setCurrentReport(null);
    setIsReportPopUpOpen(true);
  };

  const openEditReport = (report) => {
    setCurrentReport(report);
    setIsReportPopUpOpen(true);
  };

  const closeReportPopUp = () => {
    setIsReportPopUpOpen(false);
    setCurrentReport(null);
  };

  const handleReportSubmit = async (reportData) => {
    try {
      setLoading(true);
      
      if (currentReport) {
        await projectService.editReport({
          ...reportData,
          report_id: currentReport.id
        });
      } else {
        await projectService.addReport({
          ...reportData,
          project_id: projectId
        });
      }
      
      await loadProjectData();
      closeReportPopUp();
      
    } catch (err) {
      console.error('Ошибка сохранения отчета:', err);
    } finally {
      setLoading(false);
    }
  };

  // Открытие/закрытие окна добавления студентов
  const openAddStudents = async () => {
    setIsAddStudentsOpen(true);
  };

  const closeAddStudents = () => {
    setIsAddStudentsOpen(false);
  };

  // Добавление нового участника
  const handleAddStudent = (student) => {
    setInvitedMembers(prev => [...prev, {
      id: student.id || `temp_${Date.now()}`,
      name: student.name,
      surname: student.surname,
      role: student.roles ? student.roles.join(', ') : student.role,
      roles: student.roles || []
    }]);
    
    const newMember = {
      id: student.id || `temp_${Date.now()}`,
      name: student.name,
      surname: student.surname,
      role: student.roles ? student.roles.join(', ') : student.role
    };
    
    setEditForm(prev => ({
      ...prev,
      team: [...prev.team, newMember]
    }));
    setTeam(prev => [...prev, newMember]);
    
    closeAddStudents();
  };

  // Обработчики для завершения проекта
  const openDonePopUp = () => {
    if (projectData?.allowed_actions?.can_finish) {
      setIsDonePopUpOpen(true);
    }
  };

  const closeDonePopUp = () => {
    setIsDonePopUpOpen(false);
  };

  const handleDoneProject = async () => {
    try {
      setLoading(true);
      await projectService.finishProject(projectId);
      setIsDonePopUpOpen(false);
      loadProjectData();
    } catch (err) {
      console.error('Ошибка завершения проекта:', err);
    } finally {
      setLoading(false);
    }
  };

  // Рендер загрузки
  if (loading && !projectData) {
    return (
      <div className="projectMainContainer">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Загрузка проекта...</p>
        </div>
      </div>
    );
  }

  if (error || !projectData) {
    return (
      <div className="projectMainContainer">
        <Header />
        <div className="error-container">
          <h2>Ошибка</h2>
          <p>{error || 'Проект не найден'}</p>
          <button onClick={loadProjectData}>Повторить попытку</button>
        </div>
      </div>
    );
  }

  return (
    <div className="projectMainContainer">
      <Header />
      
      <div className="uniSection">
        <div className="projectHeader">
          <div className="projectHeaderTop">
            {isEditing ? (
              <input
                type="text"
                name="project_name"
                value={editForm.project_name}
                onChange={handleInputChange}
                className="project-title-input"
                placeholder="Название проекта"
              />
            ) : (
              <h1 className="projectHeaderText">{projectData.project_name}</h1>
            )}
            
            <div className="projectHeaderBtns">
              {isEditing ? (
                <>
                  <button 
                    className="ok_button"
                    onClick={handleSaveChanges}
                    disabled={loading}
                  >
                    {loading ? 'Сохранение...' : 'Сохранить'}
                  </button>
                  <button 
                    className="bad_button"
                    onClick={handleCancelEdit}
                    disabled={loading}
                  >
                    Отмена
                  </button>
                </>
              ) : (
                <>
                  {projectData.allowed_actions?.can_edit && (
                    <button 
                      onClick={handleEditToggle}
                      className="ok_button"
                    >
                      Редактировать
                    </button>
                  )}
                  {projectData.allowed_actions?.can_finish && (
                    <button 
                      onClick={openDonePopUp}
                      className="bad_button"
                    >
                      Завершить проект
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="uniInnerSection">
          {/* Команда */}
          <div className="team-section">
            <div className="section-header">
              <h2>Команда</h2>
              {isEditing && (
                <button 
                  className="add-member-btn ok_button"
                  onClick={openAddStudents}
                >
                  + Добавить участника
                </button>
              )}
            </div>
            
            <ProjectComandEdit
              team={isEditing ? editForm.team : team}
              onRemoveMember={handleRemoveMember}
              onUpdateMember={handleUpdateMember}
              onTeamUpdate={isEditing ? handleTeamUpdate : undefined}
              disabled={!isEditing}
            />
          </div>
          
          {/* Git организация */}
          <div className="git-section">
            <h2 className="section-title">Git организация</h2>
            {isEditing ? (
              <input
                type="text"
                name="git"
                value={editForm.git}
                onChange={handleInputChange}
                className="git-input"
                placeholder="Ссылка на Git репозиторий"
              />
            ) : (
              <p className="git-link">
                {projectData.git || 'Ссылка на Git не указана'}
              </p>
            )}
          </div>

          {/* Описание */}
          <div className="description-section">
            <h2 className="section-title">Описание</h2>
            {isEditing ? (
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleInputChange}
                className="description-textarea"
                placeholder="Опишите проект..."
                rows={4}
              />
            ) : (
              <p className="description-text">
                {projectData.description || 'Описание проекта отсутствует'}
              </p>
            )}
          </div>

          {/* Отчеты - просто компонент Report с передачей пропсов */}
          <Report 
            reports={projectData.reports || []}
            projectId={projectId}
            canEdit={projectData.allowed_actions?.reports}
            onReportUpdate={loadProjectData}
            onReportClick={openEditReport}
            onCreateReport={openNewReport}
            onDeleteReport={handleDeleteReport}
          />
        </div>
      </div>

      {/* Попапы */}
      <AddStudents
        isOpen={isAddStudentsOpen}
        onClose={closeAddStudents}
        onAddStudent={handleAddStudent}
        projectId={projectId}
      />

      <NewReport
        isOpen={isReportPopUpOpen}
        onClose={closeReportPopUp}
        reportData={currentReport}
        onSubmit={handleReportSubmit}
      />

      <UniPopUp 
        isOpen={isDonePopUpOpen}
        onClose={closeDonePopUp}
        popupHeader="ВНИМАНИЕ"
        popupText1="Вы действительно хотите завершить разработку проекта?"
        popupText2="Это действие нельзя будет отменить."
        popupOkText="Продолжить разработку"
        popupNoText="Завершить"
        onConfirm={handleDoneProject}
        loading={loading}
      />
    </div>
  );
}

export default ProjectPage;