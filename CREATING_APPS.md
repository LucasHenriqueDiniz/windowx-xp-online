# Guia para Criação de Apps no Windows XP Online

Este guia descreve como criar e integrar novas aplicações ao projeto "Windows XP Online", garantindo a compatibilidade com os modos de operação `local` (single-player) e `online` (multiplayer).

## Arquitetura Principal

A aplicação opera em dois modos, definidos pela variável de ambiente `NEXT_PUBLIC_APP_MODE`:

1.  **Modo `local`**: A aplicação não se conecta ao Firebase. Todo o estado do desktop (ícones, janelas abertas, posições) é salvo no `localStorage` do navegador. É uma experiência puramente single-player.

2.  **Modo `online`**: A aplicação se conecta ao Firebase para uma experiência compartilhada em tempo real. Para garantir performance e evitar conflitos, o modo online **não sincroniza o objeto de estado inteiro**. Em vez disso, ele utiliza uma arquitetura baseada em eventos:
    *   **Ações do Usuário Viram Eventos:** Quando um usuário realiza uma ação (ex: mover uma janela), um evento (`MOVE_PROGRAM`) com um payload mínimo é enviado para o nó `desktop-events` do Firebase.
    *   **Sincronização via Eventos:** Todos os clientes ouvem esse nó. Ao receber um novo evento, cada cliente atualiza seu estado local de forma correspondente.
    *   Isso torna as interações rápidas, eficientes e de baixo custo.

## Passo a Passo para Criar um Novo App

### Passo 1: Definir as Propriedades do Programa

Vá para `src/types/program-definitions.ts` e adicione uma nova entrada ao objeto `programDefinitions`.

```typescript
// Exemplo: Adicionando um app de Bloco de Notas

export const programDefinitions = {
  // ... outras definições
  notepad: {
    id: "notepad",
    name: "Bloco de Notas",
    icon: "/icons/notepad-16.png", // Ícone 16x16 para a barra de título e taskbar
    desktopIcon: "/icons/notepad-32.png", // Ícone 32x32 para a área de trabalho
    defaultSize: { width: 500, height: 400 },
    isPinned: true, // Aparecerá fixado no Menu Iniciar
  },
  // Adicione sua nova definição aqui
  meu_app: {
    id: "meu_app",
    name: "Meu App",
    icon: "/icons/meu_app-16.png",
    desktopIcon: "/icons/meu_app-32.png",
    defaultSize: { width: 300, height: 200 },
    isPinned: false,
  }
};
```

### Passo 2: Criar o Componente React

Crie o componente da sua aplicação em `src/components/Programs/`. Por exemplo, `src/components/Programs/MeuApp.tsx`.

Seu componente receberá as propriedades de uma janela (`WindowPropertiesProps`), que incluem `id`, `title`, `isActive`, etc. Use o componente `Window` como o contêiner principal para obter a aparência e o comportamento de uma janela do Windows XP.

```tsx
// src/components/Programs/MeuApp.tsx

import Window from "@/components/Window/Window";
import { WindowPropertiesProps } from "@/types/window-properties";

// As props são passadas pelo ProgramManager
export default function MeuApp(props: WindowPropertiesProps) {
  return (
    // O componente Window cuida de todo o comportamento da janela
    <Window {...props}>
      {/* O conteúdo do seu aplicativo vai aqui */}
      <div className="p-4">
        Olá, mundo! Este é o Meu App.
      </div>
    </Window>
  );
}
```

### Passo 3: Registrar o Componente na Biblioteca

Vá para `src/lib/program-library.ts` e adicione seu novo componente ao `programComponentMap`. Use o carregamento dinâmico (`React.lazy`) para melhorar a performance inicial da aplicação.

```typescript
// src/lib/program-library.ts

import React from "react";

export const programComponentMap: { [key: string]: React.LazyExoticComponent<any> } = {
  // ... outros componentes
  notepad: React.lazy(() => import("@/components/Programs/Notepad")),

  // Adicione seu novo componente aqui
  meu_app: React.lazy(() => import("@/components/Programs/MeuApp")),
};
```

### Passo 4: Adicionar Ícones

Adicione os ícones que você definiu (`meu_app-16.png` e `meu_app-32.png`) à pasta `public/icons/`.

E pronto! A aplicação agora saberá como iniciar "Meu App".

## Gerenciamento de Estado para Apps Online

Se sua aplicação precisa que seu estado interno seja sincronizado entre os usuários (ex: o conteúdo de um documento de texto compartilhado, a pontuação de um jogo multiplayer), você **NÃO DEVE** escrever diretamente no Firebase.

Você deve usar o sistema de eventos.

1.  **Defina uma nova Ação:** Em `src/context/DesktopContext.tsx`, adicione uma nova `Action` ao `desktopReducer`.

    ```typescript
    type Action =
      | { type: 'SET_STATE', payload: DesktopState }
      | { type: 'MOVE_PROGRAM', payload: { id: string, position: WindowPosition } }
      // ... outras ações
      // Adicione sua nova ação aqui
      | { type: 'ATUALIZAR_MEU_APP', payload: { programId: string, novoConteudo: string } };
    ```

2.  **Implemente a Lógica no Reducer:** Adicione um `case` para a sua nova ação.

    ```typescript
    const desktopReducer = (state: DesktopState, action: Action): DesktopState => {
      switch (action.type) {
        // ... outros cases
        case 'ATUALIZAR_MEU_APP':
          return {
            ...state,
            programs: state.programs.map((p) =>
              p.id === action.payload.programId
                ? { ...p, props: { ...p.props, conteudo: action.payload.novoConteudo } }
                : p
            ),
          };
        // ...
      }
    };
    ```

3.  **Despache o Evento:** No seu componente, use a função `dispatchEvent` (que você pode obter do `useDesktop` hook) para enviar o evento.

    ```tsx
    // Dentro do seu componente MeuApp.tsx
    // ...
    // dispatchEvent será a forma de enviar a ação para outros usuários
    // no modo online. Você precisaria adaptar o DesktopContext para
    // expor essa função ou uma função wrapper.

    // Exemplo de como uma função de ação seria chamada:
    const handleContentChange = (newText: string) => {
      // Esta função seria obtida do useDesktop()
      atualizarMeuApp(props.id, newText);
    }
    ```
    *Nota: O hook `useDesktop` precisaria ser modificado para expor uma função `atualizarMeuApp` que internamente chama `dispatchEvent`.*
