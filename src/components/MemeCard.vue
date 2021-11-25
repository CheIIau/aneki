<template>
  <div>
    <v-card class="max-auto mb-7">
      <spinner v-if="loading"></spinner>
      <v-img v-show="!loading"
             contain
             @load="isLoaded"
             @loadstart="startLoading"
             :src="imageUrl"></v-img>
      <v-card-text>
        <v-row class="mr-1 mb-1 mt-2"
               app>
          <v-card-subtitle>Автор: {{author}} </v-card-subtitle>
          <v-spacer></v-spacer>
          <v-card-subtitle class="d-none d-sm-flex"> Выложено: {{formatDate(time)}} </v-card-subtitle>
        </v-row>
        <v-card-actions>
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
import Spinner from '@/components/Spinner.vue';
export default {
  data() {
    return {
      loading: false,
    };
  },
  props: {
    imageUrl: {
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
    rating: {
      type: Number,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  components: {
    Spinner,
  },
  computed: {
    ...mapGetters(['isUserLoggedIn']),
    arrowUpColor() {
      return this.isUserLoggedIn ? 'green' : 'green lighten-4';
    },
    arrowDownColor() {
      return this.isUserLoggedIn ? 'deep-orange' : 'deep-orange lighten-4';
    },
  },
  methods: {
    ...mapActions(['changeMemeVote']),
    isLoaded() {
      this.loading = false;
    },
    startLoading() {
      this.loading = true;
    },
    formatDate,
    onChangeVote(id, vote) {
      if (this.isUserLoggedIn) {
        this.changeMemeVote({ id, vote });
      }
    },
  },
};
</script>