// pageTransition 的单元测试
define(function (require){
    var PageTransition = require('../src/pageTransition'),
        $ = require('$'),
        instance = null;

    describe('pageTransition',function (){
        beforeEach(function (){
            instance = new PageTransition({
                element: '#J-page-box'
            });
        });

        it('should has render,getPage,sync,destroy,bindUI,back and transition method.',function (){
            spyOn(instance,'render');
            instance.render();
            expect(instance.render).toHaveBeenCalled();


            spyOn(instance,'getPage');
            var page = instance.getPage();
            expect(instance.getPage).toHaveBeenCalled();

            spyOn(instance,'transition');
            instance.transition('#J-page-box-nextPage');
            expect(instance.transition).toHaveBeenCalledWith('#J-page-box-nextPage');

            spyOn(instance,'bindUI');
            expect(instance.bindUI).not.toHaveBeenCalled();

            spyOn(instance,'back');
            expect(instance.back).not.toHaveBeenCalled();

            spyOn(instance,'sync');
            expect(instance.sync).not.toHaveBeenCalled();

            spyOn(instance,'destroy');
            expect(instance.destroy).not.toHaveBeenCalled();
        });

        it('It\'s getPage method should return DOM Element.',function (){
            instance.render();
            expect(instance.getPage().html().length).toBeGreaterThan(1);
        });

        it('should has options property.',function (){
            spyOn(instance,'options');
        });

        it('should has duration=300 property.',function (){
            expect(instance.options.duration).toBe(300);
        });

        it('default transition effect is -webkit-transition',function (){
            runs(function (){
                instance.render();
                instance.transition($('#J-page-box-nextPage'));
            });
            waits(1000);
            runs(function (){
                expect(instance.viewport.css('webkitTransform')).toBe('translateX(0px)');
                instance.destroy();
            })
        });

        it('set effect options to null',function (){
            runs(function (){
                instance = new PageTransition({
                    element: '#J-page-box',
                    effect: null
                });
                instance.render();
                instance.transition($('#J-page-box-nextPage'));
            });
            waits(1000);
            runs(function (){
                expect(instance.options.duration).toBe(0);
                expect(instance.options.effect).toBe('margin');
                instance.destroy();
            })
        });

        it('should has duration=30.',function (){
            instance = new PageTransition({
                element: '#J-page-box',
                duration: 30
            });
            expect(instance.options.duration).toBe(30);
        });

        it('should has transitionStart and transitionEnd events.',function (){
            runs(function (){
                instance.render();
                this.i=0,
                this.type,
                this.page,
                this.o;
                instance.on('transitionStart',function (){
                    expect(this.viewport).toBeTruthy();
                })
                instance.on('transitionEnd',$.proxy(function (type,page,o){
                    this.i++;
                    this.page = page;
                    this.type = type
                    this.o = o;
                },this));
                instance.transition('#J-page-box-nextPage');
            });

            waits(1000);

            runs(function (){
                expect(instance instanceof PageTransition).toBeTruthy();
                expect(this.i).toBe(1);
                expect(this.type).toBe('forward');
                expect(this.page.nodeType).not.toBe(0);
            });
        });

        it('back to prev page.',function (){
            instance.render();
            var currentPage = instance.getPage();

            instance.transition('#J-page-box-nextPage');

            instance.back();

            expect(currentPage[0]).toBe(instance.getPage()[0])
        });
    });
});