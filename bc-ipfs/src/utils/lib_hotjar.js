/* jshint esversion: 6 */
import { hotjar } from 'react-hotjar';

export default hotjar.initialize(CONFIG.hotjar.id, CONFIG.hotjar.version);
