// src/pages/Tasks.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    Button, Input, Card, CardHeader, CardBody, Divider,
    Checkbox, Textarea, Chip, Modal,
    ModalContent, ModalHeader, ModalBody, ModalFooter, Tabs, Tab, Badge,
    Spinner
} from '@heroui/react';
import { PlusIcon, EditIcon, Trash2Icon } from 'lucide-react';
import { Task } from '../types';
import { CustomSelect } from '../components/CustomSelect';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

const priorityOptions = [
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
];

export const Tasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<Partial<Task>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getTasks();
            setTasks(data);
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const openModal = (task?: Task) => {
        if (task) {
            setCurrentTask(task);
            setIsEditing(true);
        } else {
            setCurrentTask({ priority: 'medium', status: 'pending' });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTask({});
        setIsEditing(false);
    };

    const handleInputChange = (field: keyof Task, value: any) => {
        setCurrentTask(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveTask = async () => {
        if (!currentTask.title) return;

        try {
            if (isEditing && currentTask.id) {
                await updateTask(currentTask.id, currentTask);
            } else {
                await createTask({
                    title: currentTask.title!,
                    description: currentTask.description,
                    priority: currentTask.priority || 'medium',
                });
            }
            closeModal();
            fetchTasks();
        } catch (error) {
            console.error("Erro ao salvar tarefa:", error);
        }
    };

    const toggleTaskStatus = async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const newStatus = task.status === 'pending' ? 'completed' : 'pending';
        const updatedTask = {
            ...task,
            status: newStatus,
        };
        
        try {
            await updateTask(id, updatedTask);
            fetchTasks();
        } catch (error) {
            console.error("Erro ao atualizar status da tarefa:", error);
        }
    };

    const handleDeleteTask = async (id: string) => {
        try {
            await deleteTask(id);
            fetchTasks();
        } catch (error) {
            console.error("Erro ao deletar tarefa:", error);
        }
    };

    const getPriorityChip = (priority: 'low' | 'medium' | 'high') => {
        switch (priority) {
            case 'low': return <Chip size="sm" color="success" variant="flat">Baixa</Chip>;
            case 'medium': return <Chip size="sm" color="warning" variant="flat">Média</Chip>;
            case 'high': return <Chip size="sm" color="danger" variant="flat">Alta</Chip>;
            default: return null;
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'pending') return task.status === 'pending';
        if (filter === 'completed') return task.status === 'completed';
        return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const pendingCount = tasks.filter(t => t.status === 'pending').length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Mural de Tarefas</h1>
                    <p className="text-default-500 mt-1">
                        Organize e acompanhe suas atividades.
                    </p>
                </div>
                <Button color="primary" startContent={<PlusIcon size={16} />} onPress={() => openModal()}>
                    Nova Tarefa
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <Tabs
                        aria-label="Filtro de tarefas"
                        selectedKey={filter}
                        onSelectionChange={(key) => setFilter(key as any)}
                    >
                        <Tab key="all" title="Todas" />
                        <Tab
                            key="pending"
                            title={
                                <div className="flex items-center space-x-2">
                                    <span>Pendentes</span>
                                    {pendingCount > 0 && <Badge content={pendingCount} color="danger" size="sm"><div /></Badge>}
                                </div>
                            }
                        />
                        <Tab key="completed" title="Concluídas" />
                    </Tabs>
                </CardHeader>
                <Divider />
                <CardBody>
                    {isLoading ? (
                        <div className="text-center py-10">
                            <Spinner label="Carregando tarefas..." />
                        </div>
                    ) : filteredTasks.length > 0 ? (
                        <ul className="space-y-3">
                            {filteredTasks.map(task => (
                                <li key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border ${task.status === 'completed' ? 'border-default-200 bg-default-50 opacity-70' : 'border-divider bg-background'}`}>
                                    <Checkbox
                                        isSelected={task.status === 'completed'}
                                        onValueChange={() => toggleTaskStatus(task.id)}
                                        className="mt-1"
                                        aria-label={`Marcar tarefa ${task.title} como ${task.status === 'pending' ? 'concluída' : 'pendente'}`}
                                    />
                                    <div className="flex-grow">
                                        <p className={`font-medium ${task.status === 'completed' ? 'line-through text-default-500' : ''}`}>
                                            {task.title}
                                        </p>
                                        {task.description && (
                                            <p className="text-sm text-default-600 mt-1">{task.description}</p>
                                        )}
                                        <div className="flex items-center gap-2 mt-1">
                                            {getPriorityChip(task.priority)}
                                            <span className="text-xs text-default-500">
                                                Criada em: {new Date(task.createdAt).toLocaleDateString('pt-BR')}
                                                {task.completedAt && ` | Concluída em: ${new Date(task.completedAt).toLocaleDateString('pt-BR')}`}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 flex gap-1">
                                        <Button isIconOnly size="sm" variant="light" onPress={() => openModal(task)}>
                                            <EditIcon size={16} />
                                        </Button>
                                        <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDeleteTask(task.id)}>
                                            <Trash2Icon size={16} />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-10 text-default-500">
                            Nenhuma tarefa encontrada para este filtro.
                        </div>
                    )}
                </CardBody>
            </Card>

            <Modal isOpen={isModalOpen} onClose={closeModal} size="lg" scrollBehavior="outside">
                <ModalContent>
                    <ModalHeader>{isEditing ? 'Editar Tarefa' : 'Adicionar Nova Tarefa'}</ModalHeader>
                    <ModalBody className="space-y-4">
                        <Input
                            label="Título da Tarefa"
                            placeholder="Descreva a tarefa..."
                            value={currentTask.title || ''}
                            onValueChange={(value) => handleInputChange('title', value)}
                            isRequired
                            autoFocus
                        />
                        <Textarea
                            label="Observações (Opcional)"
                            placeholder="Detalhes adicionais..."
                            value={currentTask.description || ''}
                            onValueChange={(value) => handleInputChange('description', value)}
                        />
                        
                        <CustomSelect
                            label="Prioridade"
                            options={priorityOptions} 
                            value={currentTask.priority || 'medium'} 
                            onChange={(value) => handleInputChange('priority', value)} 
                            placeholder="Escolha a prioridade"
                        />
                       
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={closeModal}>
                            Cancelar
                        </Button>
                        <Button color="primary" onPress={handleSaveTask} isDisabled={!currentTask.title}>
                            {isEditing ? 'Salvar Alterações' : 'Adicionar Tarefa'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div >
    );
};