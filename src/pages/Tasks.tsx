// src/pages/Tasks.tsx
import React, { useState, useCallback } from 'react';
import {
    Button, Input, Card, CardHeader, CardBody, Divider,
    Checkbox, Select, SelectItem, Textarea, Chip, Modal,
    ModalContent, ModalHeader, ModalBody, ModalFooter, Tabs, Tab, Badge
} from '@heroui/react';
import { PlusIcon, EditIcon, Trash2Icon, FlagIcon } from 'lucide-react';
import { Task } from '../types'; // Importar o tipo Task

// Mock data inicial (substituir por API call ou estado persistente)
const initialTasks: Task[] = [
    { id: '1', title: 'Fazer contagem semanal do setor A', priority: 'high', status: 'pending', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), description: 'Verificar itens de alta rotatividade.' },
    { id: '2', title: 'Organizar prateleiras B1 e B2', priority: 'medium', status: 'pending', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { id: '3', title: 'Receber mercadoria do fornecedor X', priority: 'high', status: 'completed', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), completedAt: new Date(Date.now() - 1000 * 60 * 60 * 3) },
];

export const Tasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<Partial<Task>>({}); // Para adicionar/editar
    const [isEditing, setIsEditing] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');

    const openModal = (task?: Task) => {
        if (task) {
            setCurrentTask(task);
            setIsEditing(true);
        } else {
            setCurrentTask({ priority: 'medium', status: 'pending' }); // Default values
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

    const handleSaveTask = () => {
        if (!currentTask.title) return; // Validar título

        if (isEditing && currentTask.id) {
            // Lógica para editar tarefa existente
            setTasks(tasks.map(t => t.id === currentTask.id ? { ...t, ...currentTask } as Task : t));
        } else {
            // Lógica para adicionar nova tarefa
            const newTask: Task = {
                id: Date.now().toString(), // Gerar ID simples
                title: currentTask.title,
                description: currentTask.description,
                priority: currentTask.priority || 'medium',
                status: 'pending',
                createdAt: new Date(),
            };
            setTasks([newTask, ...tasks]);
        }
        closeModal();
    };

    const toggleTaskStatus = (id: string) => {
        setTasks(tasks.map(t => {
            if (t.id === id) {
                const newStatus = t.status === 'pending' ? 'completed' : 'pending';
                return {
                    ...t,
                    status: newStatus,
                    completedAt: newStatus === 'completed' ? new Date() : undefined,
                };
            }
            return t;
        }));
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
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
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Ordenar por mais recentes

    const pendingCount = tasks.filter(t => t.status === 'pending').length;

    return (
        <div className="space-y-6">
            {/* Header */}
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

            {/* Filtros e Lista */}
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
                    {filteredTasks.length > 0 ? (
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
                                        <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => deleteTask(task.id)}>
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

            {/* Modal Adicionar/Editar Tarefa */}
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
                        <Select
                            label="Prioridade"
                            selectedKeys={new Set(currentTask.priority ? [currentTask.priority] : ['medium'])}
                            onSelectionChange={(keys) => {
                                const selected = Array.from(keys)[0] as 'low' | 'medium' | 'high';
                                handleInputChange('priority', selected);
                            }}
                            startContent={<FlagIcon size={16} className="text-default-400" />}
                        >
                            <SelectItem key="low">Baixa</SelectItem>
                            <SelectItem key="medium">Média</SelectItem>
                            <SelectItem key="high">Alta</SelectItem>
                        </Select>

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