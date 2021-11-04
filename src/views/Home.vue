<template>
  <v-app>
    <v-flex v-if="!loading"
            xs10
            offset-xs1
            sm8
            offset-sm2
            md6
            offset-md3>
      <anek-card :aneks="aneks"></anek-card>
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
import AnekCard from '@/components/AnekCard.vue';

export default {
  components: { AnekCard },
  computed: {
    ...mapGetters({ aneks: 'getAneks', loading: 'loading', isUserLoggedIn: 'isUserLoggedIn' }),
  },
  created() {
    this.$store.dispatch('fetchAneks');
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
