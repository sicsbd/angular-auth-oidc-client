import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthConfiguration, OpenIDImplicitFlowConfiguration } from '../../lib/modules/auth.configuration';
import { AuthModule } from '../../lib/modules/auth.module';
import { LoggerService } from '../../lib/services/oidc.logger.service';
import { TestLogging } from '../common/test-logging.service';

describe('AuthConfiguration', () => {
    let authConfiguration: AuthConfiguration;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AuthModule.forRoot()],
            providers: [
                {
                    provide: LoggerService,
                    useClass: TestLogging,
                },
            ],
        });
    });

    describe('browser', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
            });

            authConfiguration = TestBed.get(AuthConfiguration);
        });

        it('silent_renew and start_checksession can be set to true when using the browser platform', () => {
            const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
            openIDImplicitFlowConfiguration.silent_renew = true;
            openIDImplicitFlowConfiguration.start_checksession = true;

            authConfiguration.init(openIDImplicitFlowConfiguration);

            expect(authConfiguration.silent_renew).toEqual(true);
            expect(authConfiguration.start_checksession).toEqual(true);
        });
    });

    describe('server', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
            });

            authConfiguration = TestBed.get(AuthConfiguration);
        });

        it('silent_renew and start_checksession are always false when not using the browser platform', () => {
            const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
            openIDImplicitFlowConfiguration.silent_renew = true;
            openIDImplicitFlowConfiguration.start_checksession = true;

            authConfiguration.init(openIDImplicitFlowConfiguration);

            expect(authConfiguration.silent_renew).toEqual(false);
            expect(authConfiguration.start_checksession).toEqual(false);
        });
    });
});
