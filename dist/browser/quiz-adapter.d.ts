/**
 * PRISM Quiz Adapter — DOM integration layer
 *
 * Renders engine questions one at a time into the page,
 * handles user input, routes answers to the engine,
 * and shows progress + results.
 *
 * Usage:
 *   <div id="prism-quiz"></div>
 *   <script src="prism-engine-bundle.min.js"></script>
 *   <script>
 *     PrismEngine.initQuiz();
 *     PrismEngine.mountQuiz(document.getElementById('prism-quiz'));
 *   </script>
 *
 * Or for existing quiz HTML with data-q attributes:
 *   PrismEngine.initQuiz();
 *   PrismEngine.attachToExistingQuiz({ container: document.querySelector('.container') });
 */
import type { QuizResults } from "./api.js";
interface MountOptions {
    /** Called when the quiz completes */
    onComplete?: (results: QuizResults) => void;
    /** Custom question text override map (promptShort → text) */
    questionText?: Record<string, string>;
    /** Show debug info (posterior, phase, etc.) */
    debug?: boolean;
}
/**
 * Mount the quiz into a container element.
 * Renders one question at a time with progress bar.
 */
export declare function mountQuiz(container: HTMLElement, options?: MountOptions): void;
interface AttachOptions {
    /** Container element holding the existing quiz DOM */
    container: HTMLElement;
    /** Map from HTML data-q values to engine question IDs */
    questionMap?: Record<string, number>;
    /** Called when the quiz completes */
    onComplete?: (results: QuizResults) => void;
}
/**
 * Attach to an existing quiz HTML structure.
 *
 * This hides all quiz pages and shows questions one at a time,
 * mapping between the existing DOM question IDs and the engine's
 * question IDs using the provided mapping or auto-detection.
 */
export declare function attachToExistingQuiz(options: AttachOptions): void;
export {};
