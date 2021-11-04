<template>
  <div>
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
                 :loading="localLoading"
                 color="grey"
                 @click="changeBookmarkStatus(anek.id)">
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { formatDate } from '@/functions/index.js';

export default {
  props: {
    aneks: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['isUserLoggedIn', 'loading', 'localLoading']),
    arrowUpColor() {
      return this.isUserLoggedIn ? 'green' : 'green lighten-4';
    },
    arrowDownColor() {
      return this.isUserLoggedIn ? 'deep-orange' : 'deep-orange lighten-4';
    },
  },
  created() {
    this.loadBookmarkedAneks();
  },
  methods: {
    ...mapActions(['changeVote', 'changeAnekBookmark', 'loadBookmarkedAneks']),
    formatDate,
    onChangeVote(id, vote) {
      if (this.isUserLoggedIn) {
        this.changeVote({ id, vote });
      }
    },
    changeBookmarkStatus(id) {
      this.changeAnekBookmark(id);
    },
  },
};
</script>