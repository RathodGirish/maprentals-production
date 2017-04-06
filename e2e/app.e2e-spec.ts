import { LazyLoadingWithAngular2RoutingPage } from './app.po';

describe('lazy-loading-with-angular2-routing App', function() {
  let page: LazyLoadingWithAngular2RoutingPage;

  beforeEach(() => {
    page = new LazyLoadingWithAngular2RoutingPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
