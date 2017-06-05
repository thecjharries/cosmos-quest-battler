import { CosmosQuestBattlerPage } from './app.po';

describe('cosmos-quest-battler App', () => {
  let page: CosmosQuestBattlerPage;

  beforeEach(() => {
    page = new CosmosQuestBattlerPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
