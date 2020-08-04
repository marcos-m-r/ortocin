<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app class="grey lighten-5">
      <navigation-menu />
    </v-navigation-drawer>

    <v-app-bar app color="purple lighten-1" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title><v-icon>fas fa-tooth</v-icon> OrtoCin - {{pageTitle}}</v-toolbar-title>
    </v-app-bar>

    <v-main class="grey lighten-4">
      <v-container fluid>
        <v-row align="center" justify="center">
          <v-col class="text-center">
            <router-view @update:pageTitle="updatePageTitle" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer color="purple lighten-0" app>
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import NavigationMenu from "./components/NavigationMenu.vue";

export default {
  name: "App",
  components: {
    NavigationMenu
  },
  props: {
    source: String
  },
  data: () => ({
    drawer: false,
    pageTitle: 'Application'
  }),
  methods: {
    updatePageTitle(title) {
      this.pageTitle = title;
    }
  }
};
</script>