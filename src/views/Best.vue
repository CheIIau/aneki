<template>
  <v-app>
    <v-flex v-if="!loading"
            md6
            offset-md3
            offset-sm2
            offset-xs1
            sm8
            xs10>
      <anek-card v-for="anek in aneks"
                 :id="anek.id"
                 :key="anek.id"
                 :author="anek.author"
                 :body="anek.body"
                 :rating="anek.rating"
                 :time="anek.time"
                 :title="anek.title"></anek-card>
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
  created() {
    this.clearAneks();
    this.favouriteAneks();
  },
  methods: {
    ...mapActions({
      favouriteAneks: 'fetchFavouriteAneksFromDB',
    }),
    ...mapMutations(['clearAneks']),
  },
};
</script>