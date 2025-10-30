// src/components/CustomSelect.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // <--- IMPORTAR

interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: CustomSelectOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  label?: string;
}

const useOutsideClick = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useOutsideClick(selectRef, () => setIsOpen(false));

  const selectedOption = options.find(option => option.value === value);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // --- DEFINIÇÃO DA ANIMAÇÃO ---
  const dropdownVariants = {
    hidden: { // Estado inicial e de saída
      opacity: 0,
      scale: 0.95,
      y: -5, // Começa ligeiramente acima
      transition: { duration: 0.1, ease: 'easeOut' }
    },
    visible: { // Estado quando aberto
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.1, ease: 'easeIn' }
    }
  };
  // --- FIM DA DEFINIÇÃO ---

  return (
    <div ref={selectRef} className="relative w-full">
      {/* Label (Opcional) */}
      {label && (
        <label className="block text-sm font-medium text-default-700 mb-1">
          {label}
        </label>
      )}

      {/* Gatilho (Trigger) - SEM MUDANÇAS */}
      <button
        type="button"
        className="flex items-center justify-between w-full px-3 py-2 text-left bg-default-100 border border-default-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm min-h-[40px]"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedOption ? 'text-default-800' : 'text-default-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon
          size={16}
          className={`text-default-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* --- ENVOLVER COM AnimatePresence --- */}
      <AnimatePresence>
        {isOpen && (
          // --- USAR motion.div E APLICAR VARIANTS ---
          <motion.div
            className="absolute z-50 w-full mt-1 bg-content1 border border-default-200 rounded-lg shadow-lg max-h-60 overflow-y-auto origin-top" // Adicionado origin-top
            initial="hidden" // Estado inicial
            animate="visible" // Estado ao abrir
            exit="hidden" // Estado ao fechar
            variants={dropdownVariants} // Aplica as definições de animação
            role="listbox"
          >
            <ul>
              {options.map((option) => (
                <li
                  key={option.value}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-default-100 ${value === option.value ? 'bg-default-100 font-medium' : ''}`}
                  onClick={() => handleOptionClick(option.value)}
                  role="option"
                  aria-selected={value === option.value}
                >
                  {option.label}
                </li>
              ))}
              {options.length === 0 && (
                   <li className="px-3 py-2 text-sm text-default-500 italic">
                      Nenhuma opção disponível
                   </li>
              )}
            </ul>
          </motion.div>
          // --- FIM DO motion.div ---
        )}
      </AnimatePresence>
      {/* --- FIM DO AnimatePresence --- */}
    </div>
  );
};