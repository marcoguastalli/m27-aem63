package net.marco27.aem6.components.osgi;

import org.osgi.service.component.annotations.Component;

@Component(service = HelloOsgiService.class, immediate = true)
public class HelloOsgi implements HelloOsgiService {

    @Override
    public String helloOsgi() {
        return "CIAO OSGi";
    }
}
