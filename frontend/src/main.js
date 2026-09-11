import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Pinia intentionally left out for now — not needed until store/api
// integration happens, and cuts down on what has to exist to run this.
const app = createApp(App)

app.use(router)
app.mount('#app')