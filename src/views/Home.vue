<template>
  <v-app>
    <v-flex v-if="!loading"
            xs10
            offset-xs1
            sm8
            offset-sm2
            md6
            offset-md3>
      <v-card class="max-auto mb-7"
              v-for="(anek,i) in aneks"
              :key="i">
        <v-card-text>
          <p class="text-h4 text--primary">
            {{anek.title}}
          </p>
          <div class="text--primary">
            {{anek.body}}
          </div>
          <v-row class="mr-1 mb-1 mt-2"
                 app>
            <v-spacer></v-spacer>
            <div>Автор: {{anek.author}}</div>
          </v-row>
        </v-card-text>
      </v-card>
    </v-flex>
    <div v-else>
      <v-container grid-list-xs>
        <v-flex d-flex
                justify-center
                xs-12
                class="pt-9 mt-9">
          <v-progress-circular :size="100"
                               :width="4"
                               color="primary"
                               indeterminate></v-progress-circular>
        </v-flex>
      </v-container>
    </div>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: { ...mapGetters({ aneks: 'getAneks', loading: 'loading' }) },
  created() {
    this.$store.dispatch('fetchAneks');
  },
};
</script>
