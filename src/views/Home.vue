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
            <v-card-subtitle>Автор: {{anek.author}} </v-card-subtitle>
            <v-spacer></v-spacer>
            <v-card-subtitle class="d-none d-sm-flex"> Выложено: {{formatDate(anek.time)}} </v-card-subtitle>
          </v-row>
          <v-card-actions>
            <v-btn icon
                   color="grey">
              <v-icon>mdi-bookmark</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon
                   :color="arrowUpColor"
                   @click="onChangeVote(anek.id, 'up')">
              <v-icon>mdi-arrow-up-bold</v-icon>
            </v-btn>
            <span> {{anek.rating}}</span>
            <v-btn icon
                   :color="arrowDownColor"
                   @click="onChangeVote(anek.id, 'down')">
              <v-icon>mdi-arrow-down-bold</v-icon>
            </v-btn>
          </v-card-actions>
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
import { mapGetters, mapActions } from 'vuex';
import { formatDate } from '@/functions/index.js';

export default {
  computed: {
    ...mapGetters({ aneks: 'getAneks', loading: 'loading', isUserLoggedIn: 'isUserLoggedIn' }),
    arrowUpColor() {
      return this.isUserLoggedIn ? 'green' : 'green lighten-4';
    },
    arrowDownColor() {
      return this.isUserLoggedIn ? 'deep-orange' : 'deep-orange lighten-4';
    },
  },
  created() {
    this.$store.dispatch('fetchAneks');
  },
  methods: {
    ...mapActions(['changeVote']),
    formatDate,
    onChangeVote(id, vote) {
      if (this.isUserLoggedIn) {
        this.changeVote({ id, vote });
      }
    },
  },
};
</script>
