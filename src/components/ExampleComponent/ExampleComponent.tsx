import { useTheme } from "../hooks/themePrivider.tsx";
import  './ExampleComponent.css'

export default function ExampleComponent() {
    const { theme } = useTheme();

    return (
        <div >
            <h2 >Theme Demo</h2>
            <p>
                Current theme: <strong>{theme}</strong>
            </p>
            <p>
                This component automatically adapts to light and dark themes
                using CSS variables.
            </p>

            <div className="form-group">
                <label htmlFor="example-input">Example Input</label>
                <input
                    type="text"
                    id="example-input"
                    placeholder="Type something..."
                />
            </div>

            <button className="primary-button">
                Primary Action
            </button>

            <div className="color-samples">
                <div className="color-sample primary">Primary</div>
                <div className="color-sample secondary">Secondary</div>
                <div className="color-sample success">Success</div>
                <div className="color-sample error">Error</div>
            </div>
        </div>
    );
}