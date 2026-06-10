// These two values connect us to Grady's gift database on Supabase.
const SUPABASE_URL = "https://tubbafjvtoiiqdtehwlh.supabase.co";
const SUPABASE_KEY = "sb_publishable_GQlfSDq2mwpYU7PsZTDJvQ_rk-Nkb2F";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const grid = document.getElementById("gift-grid");

async function loadGifts() {
  const { data: gifts, error } = await db
    .from("gifts")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    grid.innerHTML = `<p class="loading">Oops, something went wrong loading the list.</p>`;
    console.error(error);
    return;
  }

  grid.innerHTML = "";

  gifts.forEach((gift) => {
    const card = document.createElement("div");
    card.className = "gift-card" + (gift.claimed ? " is-claimed" : "");

    const title = document.createElement("h2");
    title.textContent = gift.name;

    const button = document.createElement("button");
    button.className = "claim-btn " + (gift.claimed ? "claimed" : "unclaimed");
    button.textContent = gift.claimed ? "Already Claimed" : "Claim This Gift";
    button.disabled = gift.claimed;

    button.addEventListener("click", () => claimGift(gift.id));

    card.appendChild(title);

    if (gift.link) {
      const viewLink = document.createElement("a");
      viewLink.className = "view-link";
      viewLink.href = gift.link;
      viewLink.target = "_blank";
      viewLink.rel = "noopener";
      viewLink.textContent = "View it →";
      card.appendChild(viewLink);
    }

    card.appendChild(button);
    grid.appendChild(card);
  });
}

async function claimGift(id) {
  const { error } = await db
    .from("gifts")
    .update({ claimed: true })
    .eq("id", id);

  if (error) {
    alert("Hmm, that didn't work. Try again!");
    console.error(error);
    return;
  }

  loadGifts();
}

loadGifts();
