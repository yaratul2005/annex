import { handleContactRequest } from '../lib/contact-handler.mjs';

export default {
  async fetch(request) {
    return handleContactRequest(request, process.env);
  }
};
