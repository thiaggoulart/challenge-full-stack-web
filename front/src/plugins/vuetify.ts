import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme: {
        dark: false,
        colors: {
          primary: '#006064',
          secondary: '#FF6F00',
          accent: '#F50057',
          background: '#FAFAFA',
          surface: '#FFFFFF',
          error: '#D32F2F',
          info: '#0288D1',
          success: '#388E3C',
          warning: '#FBC02D',
          border: '#E0E0E0',
          text: '#212121'
        }
      }
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
})
