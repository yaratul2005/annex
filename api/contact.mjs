import { handleContactRequest } from '../lib/contact-handler.mjs';
import { storeContactRequest } from '../lib/contact-store.mjs';
import { get } from '@vercel/global-config';

const contactControls = {
  async isContactPaused() {
    if (!process.env.GLOBAL_CONFIG) return false;
    return (await get('contact_paused')) === true;
  },
  async storeContactRequest(contact, env) {
    return storeContactRequest(contact, env);
  }
};

export default {
  async fetch(request) {
    return handleContactRequest(request, process.env, contactControls);
  }
};
