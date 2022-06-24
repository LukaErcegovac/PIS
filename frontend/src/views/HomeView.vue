<template>
  <div class="home">
    <router-link
      style="text-decoration: none"
      class="text-dark"
      :to="{ name: 'about', params: { Id: post.id } }"
      v-for="post in posts"
      :key="post.id"
    >
      <div class="card">
        <p class="card-body linke-secondary">
          <b>Id: </b> {{ post._id }} <br />
          <b>Naziv: </b> {{ post.naslov }}
        </p>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  components: {},
  data() {
    return {
      posts: {},
    };
  },

  async mounted() {
    let data = await fetch("http://localhost:3000/posts");
    let res = await data.json();
    console.log(res);

    this.posts = res;
  },
};
</script>
