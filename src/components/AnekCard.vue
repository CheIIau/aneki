<template>
  <div>
    <v-card class="max-auto mb-7">
      <v-card-text>
        <p class="text-h4 text--primary">
          {{title}}
        </p>
        <div class="text--primary">
          {{body}}
        </div>
        <v-row class="mr-1 mb-1 mt-2"
               app>
          <v-card-subtitle>Автор: {{author}} </v-card-subtitle>
          <v-spacer></v-spacer>
          <v-card-subtitle class="d-none d-sm-flex"> Выложено: {{formatDate(time)}} </v-card-subtitle>
        </v-row>
        <v-card-actions>
          <v-btn icon
                 :loading="localLoading"
                 :color="bookmarkColor"
                 @click="changeBookmarkStatus(id)">
            <v-icon>mdi-bookmark</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn icon
                 :color="arrowUpColor"
                 @click="onChangeVote(id, 'up')">
            <v-icon>mdi-arrow-up-bold</v-icon>
          </v-btn>
          <span> {{rating}}</span>
          <v-btn icon
                 :color="arrowDownColor"
                 @click="onChangeVote(id, 'down')">
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
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['isUserLoggedIn', 'loading', 'localLoading', 'getBookmarkedAneks']),
    arrowUpColor() {
      return this.isUserLoggedIn ? 'green' : 'green lighten-4';
    },
    arrowDownColor() {
      return this.isUserLoggedIn ? 'deep-orange' : 'deep-orange lighten-4';
    },
    bookmarkColor() {
      if (this.getBookmarkedAneks.includes(this.id)) {
        return 'green';
      }
      return 'grey';
    },
  },
  created() {
    console.log(this.rating);
  },
  methods: {
    ...mapActions(['changeVote', 'changeAnekBookmark']),
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