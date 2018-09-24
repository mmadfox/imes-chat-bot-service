module.exports = function replyTo(bus) {
  return (channelName, payload, recipients = []) => {
    const promises = [];
    const answer = async (id) => {
      const cn = `${channelName}:${id}`;
      await bus.replyToFront(cn, payload);
    };
    recipients.forEach((cid) => {
      promises.push(answer(cid));
    });
    return Promise.all(promises);
  };
};