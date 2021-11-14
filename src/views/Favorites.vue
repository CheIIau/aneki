<template>
  <v-app>
    <template>
      <v-flex
        md6
        offset-md3
        offset-sm2
        offset-xs1
        sm8
        v-if="!loading && aneksId.length !== 0"
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
      <v-container
        fluid
        v-else-if="!loading && aneksId.length == 0"
      >
        <v-layout justify-center>
          <v-flex
            fill-height
            md6
            sm8
            text-center
            xs12
          >
            <p class="text-h4 primary--text">У вас нет анеков в закладках</p>
          </v-flex>
        </v-layout>
      </v-container>
      <spinner v-else></spinner>
    </template>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getDatabase, ref, get } from 'firebase/database';
import AnekCard from '@/components/AnekCard.vue';
import Spinner from '@/components/Spinner.vue';
import Anek from '@/classes/AnekClass';

export default {
  data() {
    return {
      aneks: [],
    };
  },
  methods: {
    ...mapActions(['setLoading', 'loadBookmarkedAneks']),
    renderAneks() {
      const db = getDatabase();
      let i = 0;
      this.aneksId.forEach((anekId) => {
        const aneksRef = ref(db, 'aneks/' + anekId);
        get(aneksRef).then((snapshot) => {
          const anek = snapshot.val();
          const newAnek = new Anek(anek.title, anek.body, anek.author, anek.time, anekId, anek.rating);
          this.$set(this.aneks, i, newAnek);
          ++i;
        });
      });
    },
  },
  computed: {
    ...mapGetters({ aneksId: 'getBookmarkedAneks', loading: 'loading' }),
  },
  components: {
    AnekCard,
    Spinner,
  },
  created() {
    this.loadBookmarkedAneks();
    if (this.aneksId.length != 0) {
      this.renderAneks();
      this.setLoading(false);
    }
  },
  watch: {
    aneksId() {
      if (this.aneksId || this.aneksId.length != 0) {
        this.aneks = [];
        this.renderAneks();
        this.setLoading(false);
      }
    },
  },
};
</script>
