<template>
  <v-app>
    <v-flex
      md6
      offset-md3
      offset-sm2
      offset-xs1
      sm8
      v-if="!loading"
      xs10
    >
      <anek-card
        :author="anek.author"
        :body="anek.body"
        :id="anek.id"
        :key="anek.id"
        :rating="anek.rating"
        :time="anek.time"
        :title="anek.title"
        v-for="anek in aneks"
      ></anek-card>
    </v-flex>
    <spinner v-else></spinner>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AnekCard from '@/components/AnekCard.vue';
import Spinner from '@/components/Spinner.vue';

export default {
  components: { AnekCard, Spinner },
  computed: {
    ...mapGetters({
      aneks: 'getAneks',
      loading: 'loading',
      isUserLoggedIn: 'isUserLoggedIn',
    }),
  },
  methods: {
    ...mapActions({
      favouriteAneks: 'fetchFavouriteAneksFromDB',
    }),
  },
  created() {
    this.favouriteAneks();
  },
  watch: {
    aneks() {
      if (this.aneks.length != 0) {
        this.$store.commit('setLoading', false);
      }
    },
  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
