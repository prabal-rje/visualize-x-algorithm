import { PERSONAS } from '../../data/personas';
import { useConfigStore } from '../../stores/config';

export default function ConfigPanel() {
  const expertMode = useConfigStore((state) => state.expertMode);
  const setExpertMode = useConfigStore((state) => state.setExpertMode);
  const personaId = useConfigStore((state) => state.personaId);
  const setPersonaId = useConfigStore((state) => state.setPersonaId);

  return (
    <div data-testid="config-panel">
      <h2>Mission Loadout</h2>
      <label>
        <input
          aria-label="Expert Mode"
          checked={expertMode}
          onChange={(event) => setExpertMode(event.target.checked)}
          type="checkbox"
        />
        Expert Mode
      </label>
      <div>
        {PERSONAS.map((persona) => (
          <button
            key={persona.id}
            type="button"
            aria-pressed={persona.id === personaId}
            onClick={() => setPersonaId(persona.id)}
          >
            <div>{persona.name}</div>
            <div>{persona.subtitle}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
