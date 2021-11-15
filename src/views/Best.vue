<template>
  <v-app>
    <v-flex md6
            offset-md3
            offset-sm2
            offset-xs1
            sm8
            v-if="!loading"
            xs10>
      <anek-card :author="anek.author"
                 :body="anek.body"
                 :id="anek.id"
                 :key="anek.id"
                 :rating="anek.rating"
                 :time="anek.time"
                 :title="anek.title"
                 v-for="anek in aneks"></anek-card>
    </v-flex>
    <spinner v-else></spinner>
  </v-app>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import AnekCard from '@/components/AnekCard.vue';
import Spinner from '@/components/Spinner.vue';

export default {
  components: { AnekCard, Spinner },
  computed: {
    ...mapGetters({
      aneks: 'getAneks',
      loading: 'loading',
    }),
  },
  methods: {
    ...mapActions({
      favouriteAneks: 'fetchFavouriteAneksFromDB',
    }),
    ...mapMutations(['clearAneks']),
  },
  created() {
    this.clearAneks();
    this.favouriteAneks();
  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
