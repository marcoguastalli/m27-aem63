package net.marco27.aem6.components.osgi;


import org.osgi.service.component.annotations.Component;


@Component(immediate = true)
public class HelloOsgi {

    protected static final String PROPERTY_NAME = "osgiPropertyName";
    protected static final String PROPERTY_DEFAULT_VALUE = "osgiPropertyValue";

    private String privateProperty;

}