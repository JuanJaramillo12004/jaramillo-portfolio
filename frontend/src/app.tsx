import type { FC } from "react";

const App: FC = () => (
  <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-4xl font-semibold text-[var(--text-h)]">
        Bienvenido
      </h1>
      <p className="mt-4 text-lg leading-8 text-[var(--text)]">
        Empieza a desarrollar aquí.
      </p>
    </div>
  </main>
);

export default App;
